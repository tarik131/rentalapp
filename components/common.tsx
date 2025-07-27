import React from 'react';

// Formatting Utilities
export const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
export const formatCurrencyDetailed = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
export const formatPercent = (value: number) => `${value.toFixed(2)}%`;
export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 group-hover:text-sky-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TooltipWrapper: React.FC<{ children: React.ReactNode; tooltip: React.ReactNode }> = ({ children, tooltip }) => (
    <div className="flex items-center gap-1.5 group relative cursor-help">
        {children}
        <InfoIcon />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-slate-200 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
        </div>
    </div>
);


// Common Components
export const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md border border-slate-200/80 ${className}`}>
    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-3">{title}</h2>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface InputGroupProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: 'number' | 'text';
  step?: string;
  prefix?: string;
  suffix?: string;
  inputClassName?: string;
  tooltip?: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, name, type = 'number', step = "0.01", prefix, suffix, inputClassName = 'w-40', tooltip }) => {
    const labelContent = (
        <label htmlFor={name} className="text-sm font-medium text-slate-600 flex-shrink-0">{label}</label>
    );
    
    return (
      <div className="flex items-center justify-between gap-4">
        {tooltip ? (
            <TooltipWrapper tooltip={tooltip}>
                {labelContent}
            </TooltipWrapper>
        ) : (
            labelContent
        )}
        <div className="relative flex items-center">
          {prefix && <span className="absolute left-3 text-slate-500 text-sm">{prefix}</span>}
          <input
            id={name}
            name={name}
            type={type}
            step={step}
            value={value}
            onChange={onChange}
            className={`${inputClassName} bg-sky-50 border border-sky-200 text-slate-800 text-sm font-semibold rounded-md p-2 text-right focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none focus:bg-white transition-colors duration-200 ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
          />
          {suffix && <span className="absolute right-3 text-slate-500 text-sm">{suffix}</span>}
        </div>
      </div>
    );
};

interface DataRowProps {
    label: string;
    value: string;
    className?: string;
    tooltip?: React.ReactNode;
}

export const DataRow: React.FC<DataRowProps> = ({ label, value, className, tooltip }) => {
    const labelContent = (
        <span className="text-sm text-slate-600">{label}</span>
    );
    return (
      <div className={`flex items-center justify-between py-1.5 ${className}`}>
        {tooltip ? (
            <TooltipWrapper tooltip={tooltip}>
                {labelContent}
            </TooltipWrapper>
        ) : (
            labelContent
        )}
        <span className="text-sm font-semibold text-slate-900">{value}</span>
      </div>
    );
};

export const RuleIndicator: React.FC<{ label: string; value: string; success: boolean; tooltip: React.ReactNode }> = ({ label, value, success, tooltip }) => (
    <div className="flex items-center justify-between py-1.5">
        <TooltipWrapper tooltip={tooltip}>
            <span className="text-sm text-slate-600">{label}</span>
        </TooltipWrapper>
        <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${success ? 'text-green-600' : 'text-red-600'}`}>{value}</span>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {success ? 'Good' : 'Fail'}
            </span>
        </div>
    </div>
);