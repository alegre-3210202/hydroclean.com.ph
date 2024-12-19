
interface PercentageBlockProps {
    list: { label: string, color: 'red' | 'green' | 'blue', value: number, maxPercentage: number }[];
}

function PercentageBlock({ list }: PercentageBlockProps) {
    return (
        <>
            {list.map((item, index) => (
                <div key={index} className={item.color}>
                    <div className="status">
                        <div className="info">
                            <h3>{item.label}</h3>
                            <h1>{item.value}</h1>
                        </div>
                        <div className="progress">

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="10px" height="160px">
                                <defs>
                                    <linearGradient id="GradientColor">
                                        <stop offset="0%" stopColor="#9bbade" />
                                        <stop offset="100%" stopColor="var(--color-primary)" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    cx="38"
                                    cy="38"
                                    r="36"
                                    strokeLinecap="round"
                                    stroke="url(#GradientColor)"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 36}`}
                                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - Math.min(item.value, item.maxPercentage) / item.maxPercentage)}`}
                                />
                            </svg>
                            <div className="percentage">
                                <p>{((Math.min(item.value, item.maxPercentage) / item.maxPercentage) * 100).toFixed(0)}%</p>
                            </div>
                        </div>
                    </div> 
                </div >
            ))
            }
        </>
    );
};

export default PercentageBlock;