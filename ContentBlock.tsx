interface ContentBlockProps {
    list: { label: string, content: string }[];
}

function PercentageBlock({ list }: ContentBlockProps) {
    return (
        <>
            {list.map((item, index) => (
                <div key={index} className="content-block">
                    <div className="status">
                        <div className="info">
                            <h3>{item.label}</h3>
                            <h1>{item.content}</h1>
                        </div>
                    </div>
                </div>
            ))
            }
        </>
    );
};

export default PercentageBlock;