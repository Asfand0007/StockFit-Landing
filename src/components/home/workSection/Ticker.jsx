import { useState, useEffect } from "react";

export default function Ticker({ categoryId, color, bgColor }) {
    const [teams, setTeams] = useState([]);
    const stocks = [
        "assests/kse/1.png",
        "assests/kse/2.png",
        "assests/kse/3.png",
        "assests/kse/4.png",
        "assests/kse/5.png",
        "assests/kse/6.png",
        "assests/kse/7.png",
        "assests/kse/8.png",
    ]
    return (
        <div className="w-full mb-20 sm:mb-20 flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center w-full mb-8 gap-4">
                <div className="h-px w-1/4 bg-secondary opacity-30" />
                <h2 className='text-2xl sm:text-3xl text-secondary-dark text-center'>
                    Assests Based on KSE-30
                </h2>
                <div className="h-px w-1/4 bg-secondary opacity-30" />
                <div />
            </div>
            <div className="flex items-center w-full py-[0.55rem] overflow-hidden ">
                <div className="flex flex-row ticker">
                    {stocks?.map((item, i) => (
                        <img
                            key={i}
                            src={item}
                            alt=""
                            className="w-auto h-12 sm:w-auto sm:h-20 inline mx-5 md:mx-20 grayscale-75"
                        />
                    ))}
                </div>

                <style>{`
                        @keyframes tick {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                        }
                        @keyframes tick {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                        }

                        /* Default (mobile) */
                        .ticker {
                        animation: tick 5s linear infinite;
                        }

                        /* Larger screens */
                        @media (min-width: 768px) {
                        .ticker {
                            animation: tick 15s linear infinite;
                        }
                        }
                    `}
                </style>
            </div>
        </div>
    );
}