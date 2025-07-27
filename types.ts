export interface PropertyInfo {
  propertyType: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  sqft: number;
}

export interface Unit {
  id: number;
  beds: number;
  baths: number;
  rent: number;
}

export interface UserInputs {
  propertyInfo: PropertyInfo;
  units: Unit[];
  purchasePrice: number;
  closingCost: number;
  initialImprovements: number;
  downPaymentPercent: number;
  interestRatePercent: number;
  loanTermYears: number;
  propertyTaxYear: number;
  insuranceMonth: number;
  propertyMgmtPercent: number;
  vacancyPercent: number;
  maintenancePercent: number;
  hoaMonth: number;
  sewerMonth: number;
  garbageMonth: number;
  waterMonth: number;
  gasMonth: number;
  electricMonth: number;
  appreciationPercent: number;
  rentIncreasePercent: number;
  expenseIncreasePercent: number;
  insuranceIncreasePercent: number;
  utilitiesIncreasePercent: number;
  salesCostPercent: number;
  incomeTaxRatePercent: number;
  capitalGainsRatePercent: number;
  depreciationYears: number;
}

export interface ProFormaAnalysis {
  grossMonthlyRent: number;
  grossAnnualRent: number;
  monthlyOperatingExpenses: number;
  annualOperatingExpenses: number;
  monthlyNOI: number;
  annualNOI: number;
  capRate: number;
}

export interface MortgageCalcs {
  downPaymentAmount: number;
  loanAmount: number;
  initialInvestment: number;
  monthlyPI: number;
  annualDebtService: number;
}

export interface Returns {
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashROI: number;
  dscr: number;
  onePercentRule: number;
  fiftyPercentRule: number;
}

export interface YearlyData {
  year: number;
  propertyValue: number;
  rentalIncome: number;
  operatingExpenses: number;
  noi: number;
  debtService: number;
  interestPaid: number;
  principalPaid: number;
  remainingLoanBalance: number;
  preTaxCashFlow: number;
  depreciation: number;
  taxableIncome: number;
  taxLiability: number;
  postTaxCashFlow: number;
  totalProfitOnSale: number;
  capRateOnValue: number;
  cashOnCashPreTax: number;
  roiPreTax: number;
  cashOnCashPostTax: number;
  roiPostTax: number;
}

export interface CalculatedData {
  proForma: ProFormaAnalysis;
  mortgage: MortgageCalcs;
  returns: Returns;
  yearlyProjections: YearlyData[];
}