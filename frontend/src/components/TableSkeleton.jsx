import React from 'react';

const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              {Array(cols).fill(0).map((_, i) => (
                <th key={i} className="px-8 py-6">
                  <div className="h-2 w-16 bg-slate-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array(rows).fill(0).map((_, i) => (
              <tr key={i}>
                {Array(cols).fill(0).map((_, j) => (
                  <td key={j} className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-slate-100 rounded"></div>
                      <div className="h-2 w-16 bg-slate-50 rounded"></div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSkeleton;
