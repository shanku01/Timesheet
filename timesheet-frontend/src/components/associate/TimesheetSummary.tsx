// src/components/associate/TimesheetSummary.tsx
import React, { useEffect, useState } from 'react';

interface SummaryEntry {
  taskTitle: string;
  hours: number;
}

interface Props {
  selectedDate: string;
}

const TimesheetSummary: React.FC<Props> = ({ selectedDate }) => {
  const [summary, setSummary] = useState<SummaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/timesheet/view?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.entries || []);
        setIsLocked(data.isSubmitted || false);
        setIsLoading(false);
      });
  }, [selectedDate]);

  if (isLoading) return <p>Loading summary...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Submitted Timesheet</h2>

      {isLocked ? (
        <p className="text-green-600 font-medium mb-2">Timesheet is submitted and locked.</p>
      ) : (
        <p className="text-yellow-600 mb-2">Timesheet not submitted yet.</p>
      )}

      {summary.length === 0 ? (
        <p className="text-gray-500">No data for selected date.</p>
      ) : (
        <ul className="space-y-2">
          {summary.map((entry, idx) => (
            <li key={idx} className="border px-4 py-2 rounded shadow-sm">
              <strong>{entry.taskTitle}</strong>: {entry.hours} hrs
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimesheetSummary;
