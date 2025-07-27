import type { UserInputs, CalculatedData, ProFormaAnalysis, MortgageCalcs, Returns, YearlyData } from '../types';

const calculateMonthlyMortgage = (principal: number, annualRate: number, termYears: number): number => {
  if (annualRate <= 0) return principal / (termYears * 12);
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = termYears * 12;
  if (numberOfPayments <= 0) return 0;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return isNaN(payment) ? 0 : payment;
};

const calculateProForma = (inputs: UserInputs): ProFormaAnalysis => {
  const grossMonthlyRent = inputs.units.reduce((acc, unit) => acc + (unit.rent || 0), 0);
  const grossAnnualRent = grossMonthlyRent * 12;

  const monthlyVacancy = grossMonthlyRent * (inputs.vacancyPercent / 100);
  const monthlyMaintenance = grossMonthlyRent * (inputs.maintenancePercent / 100);
  const monthlyMgmt = grossMonthlyRent * (inputs.propertyMgmtPercent / 100);
  const monthlyTaxes = inputs.propertyTaxYear / 12;
  const monthlyUtilities = inputs.sewerMonth + inputs.garbageMonth + inputs.waterMonth + inputs.gasMonth + inputs.electricMonth;

  const monthlyOperatingExpenses = monthlyTaxes + inputs.insuranceMonth + monthlyVacancy + monthlyMaintenance + monthlyMgmt + inputs.hoaMonth + monthlyUtilities;
  const annualOperatingExpenses = monthlyOperatingExpenses * 12;

  const monthlyNOI = grossMonthlyRent - monthlyOperatingExpenses;
  const annualNOI = monthlyNOI * 12;
  const capRate = inputs.purchasePrice > 0 ? (annualNOI / inputs.purchasePrice) * 100 : 0;

  return { grossMonthlyRent, grossAnnualRent, monthlyOperatingExpenses, annualOperatingExpenses, monthlyNOI, annualNOI, capRate };
};

const calculateMortgage = (inputs: UserInputs): MortgageCalcs => {
  const downPaymentAmount = inputs.purchasePrice * (inputs.downPaymentPercent / 100);
  const loanAmount = inputs.purchasePrice - downPaymentAmount;
  const initialInvestment = downPaymentAmount + inputs.closingCost + inputs.initialImprovements;
  const monthlyPI = calculateMonthlyMortgage(loanAmount, inputs.interestRatePercent, inputs.loanTermYears);
  const annualDebtService = monthlyPI * 12;

  return { downPaymentAmount, loanAmount, initialInvestment, monthlyPI, annualDebtService };
};

const calculateReturns = (proForma: ProFormaAnalysis, mortgage: MortgageCalcs, inputs: UserInputs): Returns => {
  const monthlyCashFlow = proForma.monthlyNOI - mortgage.monthlyPI;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCashROI = mortgage.initialInvestment > 0 ? (annualCashFlow / mortgage.initialInvestment) * 100 : 0;
  const dscr = mortgage.annualDebtService > 0 ? proForma.annualNOI / mortgage.annualDebtService : Infinity;
  const onePercentRule = inputs.purchasePrice > 0 ? (proForma.grossMonthlyRent / inputs.purchasePrice) * 100 : 0;
  const fiftyPercentRule = proForma.grossAnnualRent > 0 ? (proForma.annualOperatingExpenses / proForma.grossAnnualRent) * 100 : 0;

  return { monthlyCashFlow, annualCashFlow, cashOnCashROI, dscr, onePercentRule, fiftyPercentRule };
};

const generateYearlyProjections = (inputs: UserInputs, proForma: ProFormaAnalysis, mortgage: MortgageCalcs): YearlyData[] => {
    const projections: YearlyData[] = [];
    let currentPropertyValue = inputs.purchasePrice;
    let currentRentalIncome = proForma.grossAnnualRent;
    
    // Initialize annual expense components
    let currentAnnualPropertyTax = inputs.propertyTaxYear;
    let currentAnnualInsurance = inputs.insuranceMonth * 12;
    let currentAnnualHoa = inputs.hoaMonth * 12;
    let currentAnnualUtilities = (inputs.sewerMonth + inputs.garbageMonth + inputs.waterMonth + inputs.gasMonth + inputs.electricMonth) * 12;

    let remainingLoanBalance = mortgage.loanAmount;
    const depreciationBase = inputs.purchasePrice; // Simplified: Land value should be subtracted.
    const annualDepreciation = inputs.depreciationYears > 0 ? depreciationBase / inputs.depreciationYears : 0;

    for (let year = 1; year <= Math.max(inputs.loanTermYears, 30); year++) { // Project for at least 30 years
        if (year > 1) {
            currentPropertyValue *= (1 + inputs.appreciationPercent / 100);
            currentRentalIncome *= (1 + inputs.rentIncreasePercent / 100);
            
            // Apply specific expense increases
            currentAnnualPropertyTax *= (1 + inputs.expenseIncreasePercent / 100); // Assuming tax increases with general expenses
            currentAnnualInsurance *= (1 + inputs.insuranceIncreasePercent / 100);
            currentAnnualUtilities *= (1 + inputs.utilitiesIncreasePercent / 100);
            currentAnnualHoa *= (1 + inputs.expenseIncreasePercent / 100);
        }

        // Rent-dependent expenses are calculated each year
        const annualVacancy = currentRentalIncome * (inputs.vacancyPercent / 100);
        const annualMaintenance = currentRentalIncome * (inputs.maintenancePercent / 100);
        const annualMgmt = currentRentalIncome * (inputs.propertyMgmtPercent / 100);
        
        const currentOperatingExpenses = currentAnnualPropertyTax + currentAnnualInsurance + currentAnnualUtilities + currentAnnualHoa + annualVacancy + annualMaintenance + annualMgmt;

        let totalInterestForYear = 0;
        let totalPrincipalForYear = 0;
        
        if (remainingLoanBalance > 0 && mortgage.monthlyPI > 0) {
            const monthlyRate = inputs.interestRatePercent / 100 / 12;
            let yearStartBalance = remainingLoanBalance;
            for (let month = 1; month <= 12; month++) {
                const interestForMonth = yearStartBalance * monthlyRate;
                if (mortgage.monthlyPI < interestForMonth) { // Interest-only or error case
                    totalInterestForYear += mortgage.monthlyPI * 12;
                    totalPrincipalForYear = 0;
                    break; 
                }
                const principalForMonth = mortgage.monthlyPI - interestForMonth;
                totalInterestForYear += interestForMonth;
                totalPrincipalForYear += principalForMonth;
                yearStartBalance -= principalForMonth;
            }
             remainingLoanBalance = yearStartBalance;
        }

        if (remainingLoanBalance < 0) remainingLoanBalance = 0;

        const noi = currentRentalIncome - currentOperatingExpenses;
        const debtService = totalInterestForYear + totalPrincipalForYear;
        const preTaxCashFlow = noi - debtService;
        
        const depreciationForYear = year <= inputs.depreciationYears ? annualDepreciation : 0;
        const taxableIncome = noi - totalInterestForYear - depreciationForYear;
        const taxLiability = taxableIncome > 0 ? taxableIncome * (inputs.incomeTaxRatePercent / 100) : 0;
        const postTaxCashFlow = preTaxCashFlow - taxLiability;

        const salesCost = currentPropertyValue * (inputs.salesCostPercent / 100);
        const accumulatedDepreciation = year <= inputs.depreciationYears ? annualDepreciation * year : annualDepreciation * inputs.depreciationYears;
        const adjustedBasis = inputs.purchasePrice + inputs.initialImprovements - accumulatedDepreciation;

        const capitalGain = currentPropertyValue - adjustedBasis - salesCost;
        const capitalGainsTax = capitalGain > 0 ? capitalGain * (inputs.capitalGainsRatePercent / 100) : 0;
        const totalProfitOnSale = currentPropertyValue - remainingLoanBalance - salesCost - capitalGainsTax;

        const { initialInvestment } = mortgage;
        const capRateOnValue = currentPropertyValue > 0 ? (noi / currentPropertyValue) * 100 : 0;
        const cashOnCashPreTax = initialInvestment > 0 ? (preTaxCashFlow / initialInvestment) * 100 : 0;
        const roiPreTax = initialInvestment > 0 ? ((preTaxCashFlow + totalPrincipalForYear) / initialInvestment) * 100 : 0;
        const cashOnCashPostTax = initialInvestment > 0 ? (postTaxCashFlow / initialInvestment) * 100 : 0;
        const roiPostTax = initialInvestment > 0 ? ((postTaxCashFlow + totalPrincipalForYear) / initialInvestment) * 100 : 0;

        projections.push({
            year,
            propertyValue: currentPropertyValue,
            rentalIncome: currentRentalIncome,
            operatingExpenses: currentOperatingExpenses,
            noi,
            debtService,
            interestPaid: totalInterestForYear,
            principalPaid: totalPrincipalForYear,
            remainingLoanBalance: remainingLoanBalance,
            preTaxCashFlow,
            depreciation: depreciationForYear,
            taxableIncome,
            taxLiability,
            postTaxCashFlow,
            totalProfitOnSale,
            capRateOnValue,
            cashOnCashPreTax,
            roiPreTax,
            cashOnCashPostTax,
            roiPostTax,
        });
    }
    return projections;
};

export const calculateAllMetrics = (inputs: UserInputs): CalculatedData => {
  const proForma = calculateProForma(inputs);
  const mortgage = calculateMortgage(inputs);
  const returns = calculateReturns(proForma, mortgage, inputs);
  const yearlyProjections = generateYearlyProjections(inputs, proForma, mortgage);

  return { proForma, mortgage, returns, yearlyProjections };
};