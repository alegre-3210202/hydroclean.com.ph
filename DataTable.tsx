import { useEffect, useState } from 'react';
import fetchData from './GetData';
import { isValidDate, formatDateTime } from './DateTime'; // Ensure these functions are defined properly

interface TableProps {
    url: string;
    className: string;
    customNames?: string[];
    title: string;
    maxRows?: number;
    refreshInterval?: number; // Add an optional refresh interval prop
}

export default function DataTable({
    url,
    className,
    customNames,
    title,
    maxRows = 0,
    refreshInterval = 1000,
}: TableProps) {
    const [list, setList] = useState<any[]>([]);
    const [columnNames, setColumnNames] = useState<string[]>([]);

    useEffect(() => {
        async function fetchList() {
            const data = await fetchData(url);
            // console.log(data); // Uncomment for debugging

            const list = data.map((item: any) => {
                // Format the date to YYYY-MM-DD
                const formattedDate = formatDateTime(item.dateTime); // Make sure this function formats correctly
                return {
                    values: Object.keys(item).filter(key => key !== 'Id').map(key => key === 'dateTime' ? formattedDate : item[key])
                };
            });

            const columnNames =
                customNames && customNames.length > 0
                    ? customNames
                    : [...Object.keys(data[0]).filter(key => key !== 'Id')];

            const sortedList = [...list].sort((a, b) => {
                const dateA = new Date(a.values[0]);
                const dateB = new Date(b.values[0]);
                return dateB.getTime() - dateA.getTime(); // Descending order
            });

            setList(sortedList);
            setColumnNames(columnNames);
        }

        fetchList(); // Initial fetch

        const intervalId = setInterval(fetchList, refreshInterval); // Set up interval

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [url, refreshInterval]);

    return (
        <div className={className}>
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        {columnNames.map((item, index) => (
                            <th key={index}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {list.slice(0, maxRows === 0 ? list.length : maxRows).map((item: any, rowIndex: number) => (
                        <tr key={rowIndex}>
                            {item.values.map((value: any, colIndex: number) => (
                                <td key={colIndex}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {maxRows !== 0 && list.length > maxRows && (
                <a href="history">Show All</a>
            )}
        </div>
    );
}