
import React from 'react';
import type { UserInputs, Unit, PropertyInfo } from '../types';
import { SectionCard, InputGroup, formatCurrency } from './common';

interface SectionProps {
  inputs: UserInputs;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface PropertyInfoProps {
    propertyInfo: PropertyInfo;
    handlePropertyInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

export const PropertyInfoInputs: React.FC<PropertyInfoProps> = ({ propertyInfo, handlePropertyInfoChange }) => {
    const googleMapsUrl = React.useMemo(() => {
        const { street, city, state, zipCode } = propertyInfo;
        if (!street || !city) return '#';
        const address = `${street}, ${city}, ${state} ${zipCode}`;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }, [propertyInfo]);

    return (
        <SectionCard title="Property Information">
            <InputGroup label="Property Type" name="propertyType" value={propertyInfo.propertyType} onChange={handlePropertyInfoChange} type="text" inputClassName="w-40 text-left"/>
            <InputGroup label="Street" name="street" value={propertyInfo.street} onChange={handlePropertyInfoChange} type="text" inputClassName="w-40 text-left"/>
            <InputGroup label="City" name="city" value={propertyInfo.city} onChange={handlePropertyInfoChange} type="text" inputClassName="w-40 text-left"/>
            <InputGroup label="State" name="state" value={propertyInfo.state} onChange={handlePropertyInfoChange} type="text" inputClassName="w-40 text-left"/>
            <InputGroup label="Zip Code" name="zipCode" value={propertyInfo.zipCode} onChange={handlePropertyInfoChange} type="text" inputClassName="w-40 text-left"/>
            <InputGroup label="Sqft" name="sqft" value={propertyInfo.sqft} onChange={handlePropertyInfoChange} type="number" step="10"/>
            <div className="pt-4 mt-4 border-t border-slate-200">
                <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-lg hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all"
                >
                    <MapPinIcon />
                    View on Google Maps
                </a>
            </div>
        </SectionCard>
    );
};

interface UnitBreakdownProps {
    units: Unit[];
    handleUnitChange: (index: number, field: keyof Unit, value: string | number) => void;
    addUnit: () => void;
    removeUnit: (index: number) => void;
}

export const UnitBreakdown: React.FC<UnitBreakdownProps> = ({ units, handleUnitChange, addUnit, removeUnit }) => {
    const totals = units.reduce((acc, unit) => {
        acc.beds += Number(unit.beds) || 0;
        acc.baths += Number(unit.baths) || 0;
        acc.rent += Number(unit.rent) || 0;
        return acc;
    }, { beds: 0, baths: 0, rent: 0 });

    const inputStyle = "w-full bg-sky-50 border border-sky-200 text-slate-800 font-semibold rounded-md p-1.5 text-center focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none focus:bg-white transition-colors duration-200";

    return (
        <SectionCard title="Unit Breakdown">
            <div className="w-full text-sm">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 font-semibold text-slate-500 pb-2 border-b">
                    <div className="col-span-2">Unit #</div>
                    <div className="col-span-2 text-center">Beds</div>
                    <div className="col-span-2 text-center">Baths</div>
                    <div className="col-span-4 text-right">Rent/Mo</div>
                    <div className="col-span-2"></div>
                </div>
                {/* Units */}
                <div className="space-y-2 mt-2">
                    {units.map((unit, index) => (
                        <div key={unit.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-2 font-medium text-slate-700">#{index + 1}</div>
                            <input type="number" value={unit.beds} onChange={e => handleUnitChange(index, 'beds', e.target.value)} className={`col-span-2 ${inputStyle}`} />
                            <input type="number" value={unit.baths} onChange={e => handleUnitChange(index, 'baths', e.target.value)} className={`col-span-2 ${inputStyle}`} />
                            <div className="col-span-4 relative flex items-center">
                                <span className="absolute left-2.5 text-slate-500">$</span>
                                <input type="number" value={unit.rent} onChange={e => handleUnitChange(index, 'rent', e.target.value)} className={`${inputStyle} text-right pl-6`} />
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button onClick={() => removeUnit(index)} className="text-red-400 hover:text-red-600 font-bold text-xl transition-colors">&times;</button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Totals */}
                <div className="grid grid-cols-12 gap-2 font-bold text-slate-800 pt-3 border-t mt-3">
                    <div className="col-span-2">Totals</div>
                    <div className="col-span-2 text-center">{totals.beds}</div>
                    <div className="col-span-2 text-center">{totals.baths}</div>
                    <div className="col-span-4 text-right">{formatCurrency(totals.rent)}</div>
                    <div className="col-span-2"></div>
                </div>
            </div>
            <button onClick={addUnit} className="mt-4 w-full bg-sky-600 text-white font-semibold py-2.5 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all">
                + Add Unit
            </button>
        </SectionCard>
    );
};

export const InvestmentInputs: React.FC<SectionProps> = ({ inputs, handleInputChange }) => (
  <SectionCard title="Investment & Loan">
    <InputGroup label="Purchase Price" name="purchasePrice" value={inputs.purchasePrice} onChange={handleInputChange} prefix="$" step="1000" />
    <InputGroup label="Closing Costs" name="closingCost" value={inputs.closingCost} onChange={handleInputChange} prefix="$" step="100" />
    <InputGroup label="Initial Improvements" name="initialImprovements" value={inputs.initialImprovements} onChange={handleInputChange} prefix="$" step="100" />
    <hr className="my-2 border-t border-slate-200" />
    <InputGroup label="Down Payment" name="downPaymentPercent" value={inputs.downPaymentPercent} onChange={handleInputChange} suffix="%" />
    <InputGroup label="Interest Rate" name="interestRatePercent" value={inputs.interestRatePercent} onChange={handleInputChange} suffix="%" />
    <InputGroup label="Loan Term" name="loanTermYears" value={inputs.loanTermYears} onChange={handleInputChange} suffix="yrs" step="1" />
  </SectionCard>
);

export const OperationsInputs: React.FC<SectionProps> = ({ inputs, handleInputChange }) => (
  <SectionCard title="Operating Expenses">
    <InputGroup label="Property Tax (Yearly)" name="propertyTaxYear" value={inputs.propertyTaxYear} onChange={handleInputChange} prefix="$" step="100" />
    <InputGroup label="Insurance (Monthly)" name="insuranceMonth" value={inputs.insuranceMonth} onChange={handleInputChange} prefix="$" step="10" />
     <hr className="my-2 border-t border-slate-200" />
    <InputGroup label="Property Mgmt" name="propertyMgmtPercent" value={inputs.propertyMgmtPercent} onChange={handleInputChange} suffix="%" />
    <InputGroup label="Vacancy" name="vacancyPercent" value={inputs.vacancyPercent} onChange={handleInputChange} suffix="%" />
    <InputGroup label="Maintenance" name="maintenancePercent" value={inputs.maintenancePercent} onChange={handleInputChange} suffix="%" />
    <InputGroup label="HOA (Monthly)" name="hoaMonth" value={inputs.hoaMonth} onChange={handleInputChange} prefix="$" step="10"/>
     <hr className="my-2 border-t border-slate-200" />
    <h3 className="text-sm font-semibold text-slate-700 -mb-2">Monthly Utilities</h3>
    <InputGroup label="Sewer" name="sewerMonth" value={inputs.sewerMonth} onChange={handleInputChange} prefix="$" step="5"/>
    <InputGroup label="Garbage" name="garbageMonth" value={inputs.garbageMonth} onChange={handleInputChange} prefix="$" step="5"/>
    <InputGroup label="Water" name="waterMonth" value={inputs.waterMonth} onChange={handleInputChange} prefix="$" step="5"/>
    <InputGroup label="Gas" name="gasMonth" value={inputs.gasMonth} onChange={handleInputChange} prefix="$" step="5"/>
    <InputGroup label="Electric" name="electricMonth" value={inputs.electricMonth} onChange={handleInputChange} prefix="$" step="5"/>
  </SectionCard>
);

export const AssumptionsInputs: React.FC<SectionProps> = ({ inputs, handleInputChange }) => (
  <SectionCard title="Long-Term Assumptions">
    <InputGroup label="Appreciation" name="appreciationPercent" value={inputs.appreciationPercent} onChange={handleInputChange} suffix="%" 
        tooltip={<p>The estimated annual percentage increase in the property's value. A common estimate is 2-4%.</p>}
    />
    <InputGroup label="Rent Increase" name="rentIncreasePercent" value={inputs.rentIncreasePercent} onChange={handleInputChange} suffix="%"
        tooltip={<p>The estimated annual percentage increase for rent. This often tracks with inflation.</p>}
    />
    <InputGroup label="Expense Increase" name="expenseIncreasePercent" value={inputs.expenseIncreasePercent} onChange={handleInputChange} suffix="%" 
        tooltip={<p>The estimated annual increase for general operating expenses NOT covered by other specific rates (e.g., property taxes, HOA).</p>}
    />
    <InputGroup label="Insurance Increase" name="insuranceIncreasePercent" value={inputs.insuranceIncreasePercent} onChange={handleInputChange} suffix="%" 
        tooltip={<p>The estimated annual percentage increase specifically for property insurance premiums.</p>}
    />
    <InputGroup label="Utilities Increase" name="utilitiesIncreasePercent" value={inputs.utilitiesIncreasePercent} onChange={handleInputChange} suffix="%" 
        tooltip={<p>The estimated annual percentage increase specifically for utility costs.</p>}
    />
    <InputGroup label="Sales Cost" name="salesCostPercent" value={inputs.salesCostPercent} onChange={handleInputChange} suffix="%" 
        tooltip={<p>The percentage of the future sales price that will be spent on closing costs, commissions, and fees when you sell.</p>}
    />
    <hr className="my-2 border-t border-slate-200" />
    <InputGroup label="Income Tax Rate" name="incomeTaxRatePercent" value={inputs.incomeTaxRatePercent} onChange={handleInputChange} suffix="%" 
        tooltip={<p>Your marginal federal + state income tax rate. This is used to calculate tax on your annual cash flow.</p>}
    />
    <InputGroup label="Capital Gains Rate" name="capitalGainsRatePercent" value={inputs.capitalGainsRatePercent} onChange={handleInputChange} suffix="%" 
        tooltip={<p>The tax rate applied to your profit when you sell the property. This depends on your income and how long you've held the property.</p>}
    />
    <InputGroup label="Depreciation Term" name="depreciationYears" value={inputs.depreciationYears} onChange={handleInputChange} suffix="yrs" step="0.5" 
        tooltip={<p>The number of years over which you can depreciate the property's value for tax purposes. Standard for residential is 27.5 years.</p>}
    />
  </SectionCard>
);
