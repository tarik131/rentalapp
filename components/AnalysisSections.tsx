import React from 'react';
import type { CalculatedData, YearlyData } from '../types';
import { SectionCard, DataRow, formatCurrency, formatPercent, formatNumber, RuleIndicator, formatCurrencyDetailed } from './common';

interface AnalysisProps {
  data: CalculatedData;
}

export const ProFormaAnalysis: React.FC<AnalysisProps> = ({ data }) => {
  const { proForma } = data;
  return (
    <SectionCard title="Pro Forma Analysis">
      <DataRow label="Gross Monthly Rent" value={formatCurrency(proForma.grossMonthlyRent)} />
      <DataRow 
        label="Monthly Expenses" 
        value={formatCurrency(proForma.monthlyOperatingExpenses)} 
        tooltip={<p>Total monthly costs to operate the property, EXCLUDING the mortgage payment. Includes taxes, insurance, vacancy, maintenance, management, HOA, and utilities.</p>}
      />
      <DataRow 
        label="Monthly NOI" 
        value={formatCurrency(proForma.monthlyNOI)} 
        className="font-bold border-t border-slate-200 mt-2 pt-2"
        tooltip={<p>Net Operating Income per month. Calculated as Gross Monthly Rent - Monthly Operating Expenses. This is the profit before the mortgage is paid.</p>}
      />
      <DataRow 
        label="Annual NOI" 
        value={formatCurrency(proForma.annualNOI)} 
        tooltip={<p>Net Operating Income per year (Monthly NOI x 12). A key metric for evaluating a property's profitability before financing.</p>}
      />
      <DataRow 
        label="Cap Rate" 
        value={formatPercent(proForma.capRate)}
        tooltip={<p>Capitalization Rate. Calculated as Annual NOI / Purchase Price. It measures the unleveraged return on the investment.</p>}
      />
    </SectionCard>
  );
};

export const ReturnsAnalysis: React.FC<AnalysisProps> = ({ data }) => {
  const { returns, mortgage } = data;
  return (
    <SectionCard title="Key Metrics & Returns">
      <DataRow 
        label="Initial Investment" 
        value={formatCurrency(mortgage.initialInvestment)}
        tooltip={
            <div>
                <p className="font-bold mb-1">The total out-of-pocket cash required to purchase the property.</p>
                <p className="text-slate-300"><strong>Formula:</strong> Down Payment + Closing Costs + Initial Improvements.</p>
            </div>
        }
      />
      <DataRow 
        label="Monthly Cash Flow" 
        value={formatCurrency(returns.monthlyCashFlow)} 
        className="font-bold border-t border-slate-200 mt-2 pt-2"
        tooltip={
            <div>
                <p className="font-bold mb-1">Profit per month after all expenses, including mortgage, are paid.</p>
                <p className="text-slate-300"><strong>Formula:</strong> Monthly NOI - Monthly Mortgage Payment.</p>
            </div>
        }
      />
      <DataRow 
        label="Annual Cash Flow" 
        value={formatCurrency(returns.annualCashFlow)}
        tooltip={
            <div>
                <p className="font-bold mb-1">Total profit generated by the property over a full year.</p>
                <p className="text-slate-300"><strong>Formula:</strong> Monthly Cash Flow x 12.</p>
            </div>
        }
      />
      <DataRow 
        label="Cash on Cash ROI" 
        value={formatPercent(returns.cashOnCashROI)} 
        className="font-bold"
        tooltip={
            <div>
                <p className="font-bold mb-1">Measures the annual return on the actual cash invested. A key profitability metric.</p>
                <p className="text-slate-300"><strong>Formula:</strong> (Annual Cash Flow / Initial Investment) x 100%.</p>
            </div>
        }
       />
    </SectionCard>
  );
};

export const RulesAnalysis: React.FC<AnalysisProps> = ({ data }) => {
    const { returns } = data;
    return (
        <SectionCard title="Investment Rules">
            <RuleIndicator 
                label="1% Rule" 
                value={formatPercent(returns.onePercentRule)} 
                success={returns.onePercentRule >= 1}
                tooltip={
                    <div>
                        <p className="font-bold mb-1">Gross monthly rent should be at least 1% of the purchase price.</p>
                        <p className="text-slate-300"><strong>Example:</strong> A $300,000 property should rent for at least $3,000/month to meet this rule.</p>
                    </div>
                }
            />
            <RuleIndicator 
                label="50% Rule" 
                value={formatPercent(returns.fiftyPercentRule)} 
                success={returns.fiftyPercentRule <= 50}
                tooltip={
                    <div>
                        <p className="font-bold mb-1">Operating expenses (excluding mortgage) should be about 50% of gross rent.</p>
                        <p className="text-slate-300"><strong>Example:</strong> If gross rent is $4,000/month, you can expect about $2,000/month in operating expenses.</p>
                    </div>
                }
            />
            <RuleIndicator 
                label="DSCR" 
                value={returns.dscr.toFixed(2)} 
                success={returns.dscr >= 1.25}
                tooltip={
                    <div>
                        <p className="font-bold mb-1">Debt Service Coverage Ratio. Lenders often require this to be &gt; 1.25.</p>
                        <p className="text-slate-300"><strong>Formula:</strong> Annual Net Operating Income / Annual Mortgage Payments. It measures if cash flow can cover the debt.</p>
                    </div>
                }
            />
        </SectionCard>
    );
};

const TableHeader: React.FC<{ columns: string[]; alignRight?: boolean[] }> = ({ columns, alignRight = [] }) => (
    <thead>
        <tr className="border-b border-slate-300 bg-slate-100">
            {columns.map((col, index) => <th key={col} className={`p-3 text-xs font-semibold uppercase tracking-wider text-left text-slate-500 ${alignRight[index] ? 'text-right' : ''}`}>{col}</th>)}
        </tr>
    </thead>
);

const ProjectionTable: React.FC<{ title: string; data: YearlyData[]; columns: { key: keyof YearlyData; label: string }[] }> = ({ title, data, columns }) => {
    const displayYears = [1, 2, 3, 5, 10, 15, 20, 30];
    const filteredData = data.filter(d => displayYears.includes(d.year));

    return (
        <SectionCard title={title} className="col-span-1 lg:col-span-2">
            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[600px]">
                    <TableHeader columns={columns.map(c => c.label)} alignRight={columns.map(c => c.key !== 'year')} />
                    <tbody>
                        {filteredData.map(item => (
                             <tr key={item.year} className="border-b border-slate-200 last:border-b-0 even:bg-slate-50 hover:bg-sky-100/70 transition-colors duration-200">
                                {columns.map(col => (
                                    <td key={col.key} className={`p-3 text-sm text-slate-700 whitespace-nowrap ${col.key !== 'year' ? 'text-right' : 'text-left'}`}>
                                        {col.key === 'year' ? 
                                            <span className="font-bold text-slate-800">{item.year}</span> : 
                                            formatCurrency(item[col.key] as number)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SectionCard>
    );
};

const ReturnOnInvestmentTable: React.FC<AnalysisProps> = ({ data }) => {
    const displayYears = [1, 2, 3, 5, 10, 15, 20, 30];
    const filteredData = data.yearlyProjections.filter(d => displayYears.includes(d.year));
    
    const metrics: { label: string; key: keyof YearlyData }[] = [
        { label: 'Cap Rate', key: 'capRateOnValue' },
        { label: 'Cash on Cash (Pre-Tax)', key: 'cashOnCashPreTax' },
        { label: 'ROI (Pre-Tax)', key: 'roiPreTax' },
        { label: 'Cash on Cash (Post-Tax)', key: 'cashOnCashPostTax' },
        { label: 'ROI (Post-Tax)', key: 'roiPostTax' },
    ];

    return (
        <SectionCard title="% Return on Initial Investment" className="col-span-1 lg:col-span-2">
            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[600px]">
                    <TableHeader columns={['Metric', ...displayYears.map(String)]} alignRight={displayYears.map(() => true)} />
                    <tbody>
                        {metrics.map(metric => (
                            <tr key={metric.key} className="border-b border-slate-200 last:border-b-0 even:bg-slate-50 hover:bg-sky-100/70 transition-colors duration-200">
                                <td className="p-3 text-sm font-medium text-slate-800 whitespace-nowrap">{metric.label}</td>
                                {filteredData.map(item => (
                                    <td key={`${metric.key}-${item.year}`} className="p-3 text-sm text-slate-700 text-right">
                                        {formatPercent(item[metric.key] as number)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SectionCard>
    );
};


export const YearlyAnalysisTables: React.FC<AnalysisProps> = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 col-span-1 md:col-span-2 lg:col-span-4">
        <ProjectionTable 
            title="Yearly Financial Projections"
            data={data.yearlyProjections}
            columns={[
                { key: 'year', label: 'Year' },
                { key: 'propertyValue', label: 'Value' },
                { key: 'rentalIncome', label: 'Income' },
                { key: 'operatingExpenses', label: 'Expenses' },
                { key: 'noi', label: 'NOI' },
                { key: 'preTaxCashFlow', label: 'Pre-Tax CF' },
                { key: 'postTaxCashFlow', label: 'Post-Tax CF' },
            ]}
        />
        <ProjectionTable 
            title="Yearly Loan & Equity Analysis"
            data={data.yearlyProjections}
            columns={[
                { key: 'year', label: 'Year' },
                { key: 'interestPaid', label: 'Interest' },
                { key: 'principalPaid', label: 'Principal' },
                { key: 'remainingLoanBalance', label: 'Balance' },
                { key: 'depreciation', label: 'Depreciation' },
                { key: 'taxLiability', label: 'Tax Due' },
                { key: 'totalProfitOnSale', label: 'Est. Profit on Sale' },
            ]}
        />
        <ReturnOnInvestmentTable data={data} />
    </div>
);