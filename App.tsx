import React, { useState, useMemo, useCallback } from 'react';
import type { UserInputs, Unit } from './types';
import { calculateAllMetrics } from './services/calculationService';
import { PropertyInfoInputs, UnitBreakdown, InvestmentInputs, OperationsInputs, AssumptionsInputs } from './components/CalculatorSections';
import { ProFormaAnalysis, ReturnsAnalysis, RulesAnalysis, YearlyAnalysisTables } from './components/AnalysisSections';

const initialInputs: UserInputs = {
  propertyInfo: {
    propertyType: 'House',
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210',
    sqft: 1500,
  },
  units: [
    { id: Date.now(), beds: 3, baths: 2, rent: 4000 },
  ],
  purchasePrice: 300000,
  closingCost: 6000,
  initialImprovements: 0,
  downPaymentPercent: 20,
  interestRatePercent: 6.75,
  loanTermYears: 30,
  propertyTaxYear: 7000,
  insuranceMonth: 150,
  propertyMgmtPercent: 0,
  vacancyPercent: 5,
  maintenancePercent: 10,
  hoaMonth: 50,
  sewerMonth: 0,
  garbageMonth: 0,
  waterMonth: 0,
  gasMonth: 0,
  electricMonth: 0,
  appreciationPercent: 2,
  rentIncreasePercent: 2,
  expenseIncreasePercent: 2,
  insuranceIncreasePercent: 2,
  utilitiesIncreasePercent: 2,
  salesCostPercent: 8,
  incomeTaxRatePercent: 22,
  capitalGainsRatePercent: 15,
  depreciationYears: 27.5,
};

function App() {
  const [inputs, setInputs] = useState<UserInputs>(initialInputs);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  }, []);
  
  const handlePropertyInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      propertyInfo: {
        ...prevInputs.propertyInfo,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }
    }));
  }, []);

  const handleUnitChange = useCallback((index: number, field: keyof Unit, value: string | number) => {
      const newUnits = [...inputs.units];
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      newUnits[index] = { ...newUnits[index], [field]: isNaN(numValue) ? 0 : numValue };
      setInputs(prev => ({...prev, units: newUnits }));
  }, [inputs.units]);

  const addUnit = useCallback(() => {
      setInputs(prev => ({...prev, units: [...prev.units, { id: Date.now(), beds: 1, baths: 1, rent: 1000 }] }));
  }, []);

  const removeUnit = useCallback((index: number) => {
      if (inputs.units.length <= 1) return; // Prevent removing the last unit
      setInputs(prev => ({...prev, units: prev.units.filter((_, i) => i !== index) }));
  }, [inputs.units]);


  const calculatedData = useMemo(() => {
    return calculateAllMetrics(inputs);
  }, [inputs]);

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">
            Rental Property Calculator
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Analyze your next real estate investment with detailed financial projections.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <PropertyInfoInputs propertyInfo={inputs.propertyInfo} handlePropertyInfoChange={handlePropertyInfoChange} />
            <UnitBreakdown units={inputs.units} handleUnitChange={handleUnitChange} addUnit={addUnit} removeUnit={removeUnit} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <InvestmentInputs inputs={inputs} handleInputChange={handleInputChange} />
            <OperationsInputs inputs={inputs} handleInputChange={handleInputChange} />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <AssumptionsInputs inputs={inputs} handleInputChange={handleInputChange} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ProFormaAnalysis data={calculatedData} />
            <ReturnsAnalysis data={calculatedData} />
            <RulesAnalysis data={calculatedData} />
          </div>
          
          <div className="lg:col-span-4">
            <YearlyAnalysisTables data={calculatedData} />
          </div>
        </main>
        
        <footer className="text-center mt-12 py-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
                This calculator is for informational purposes only and does not constitute financial advice.
            </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
