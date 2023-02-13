import React, { useState, useEffect } from 'react';

// Stock symbols, 100 random strings
const symbols = Array.from({ length: 100 }, () => Math.random().toString(36).substring(2, 7));

// Get random price for a symbol
const getPrice = async (symbol: string): Promise<number> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const price = (Math.random() * 1000).toFixed(2);
            resolve(Number(price));
        }, 500);
    });
};

interface Stock {
    symbol: string,
    price: number
}

const StockTicker: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [tick, setTick] = useState(0);

    useEffect(() => {

        // get 100 random stocks data to show on the stocks bar
        const fetchData = async () => {
            const prices = await Promise.all(symbols.map(async symbol => {
                return { symbol, price: await getPrice(symbol) };
            }));
            setStocks(prices);
        };

        fetchData();

        // the infinitive moving function of stocks bar -> stocks bar is moving left 1px per 50ms.
        // When the stocks bar's left position becomes -12000px, it's left value is reset to 0px.
        const intervalId = window.setInterval(() => {
            setTick(tick => (tick + 1) % 12000);
        }, 50);


        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div
            className="stock-container"
            style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}
        >
            <div
                className="stock-bar"
                style={{
                    display: 'flex',
                    backgroundColor: "black",
                    borderTop: "3px solid grey",
                    borderBottom: "3px solid grey",
                    position: "absolute",
                    // this left value is set to -tick per 50ms in order to move left infinitely
                    left: -tick
                }}
            >
                {
                    stocks.map((stock: Stock) => (
                        <div
                            key={stock.symbol + "_1"}
                            className="stock-div"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: 100,
                                position: "relative",
                                marginLeft: 10,
                                marginRight: 10,
                                color: "orange",
                                fontWeight: "bolder"
                            }}
                        >
                            <div style={{ width: 100, display: "flex", marginBottom: "0.2rem" }}>
                                <div style={{ width: 50 }}> {stock.symbol} </div>
                                <div style={{ width: 50 }}> </div>
                            </div>
                            <div style={{ width: 100, display: "flex" }}>
                                <div style={{ width: 50 }}> </div>
                                <div style={{ width: 50 }}> {stock.price} </div>
                            </div>
                        </div>
                    ))}
                {/* In order to make the 100 stocks appear as if moving continuously, I attached the same 100 stocks to the tail of the first 100 stocks. */}
                {
                    stocks.map((stock: Stock) => (
                        <div
                            key={stock.symbol + "_2"}
                            className="stock-div"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: 100,
                                position: "relative",
                                marginLeft: 10,
                                marginRight: 10,
                                color: "orange",
                                fontWeight: "bolder"
                            }}
                        >
                            <div style={{ width: 100, display: "flex", marginBottom: "0.2rem" }}>
                                <div style={{ width: 50 }}> {stock.symbol} </div>
                                <div style={{ width: 50 }}> </div>
                            </div>
                            <div style={{ width: 100, display: "flex" }}>
                                <div style={{ width: 50 }}> </div>
                                <div style={{ width: 50 }}> {stock.price} </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default StockTicker;
