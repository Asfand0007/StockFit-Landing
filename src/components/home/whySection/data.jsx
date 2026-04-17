import { Globe, MessageSquare, Landmark, Zap, Target, BrainCircuit, Monitor, ShieldQuestionMark, ChartColumnIncreasing, ChartCandlestick } from "lucide-react";


export const steps = [
    {
        left: {
            icon: <Landmark size={26} strokeWidth={1.5} />,
            title: "Pakistan Stock Exchange Focus",
            description:
                "StockFit is built specifically for the Pakistan Stock Exchange, utilizing KSE-30 companies to ensure relevant and realistic portfolio construction.",
        },
        right: {
            icon: <MessageSquare size={26} strokeWidth={1.5} />,
            title: "Structured Questionnaire",
            description:
                "A guided questionnaire captures your financial goals, income stability, and investment preferences to build a strong decision foundation.",
        },
    },
    {
        left: {
            icon: <BrainCircuit size={26} strokeWidth={1.5} />,
            title: "Genetic Algorithm Optimization",
            description:
                "StockFit applies a Genetic Algorithm to evolve portfolio allocations, iteratively searching for the best balance between risk and return.",
        },
        right: {
            icon: <ShieldQuestionMark size={26} strokeWidth={1.5} />,
            title: "Risk Profiling Model",
            description:
                "Your responses are evaluated through a scoring system to classify you into risk categories such as conservative, balanced, or aggressive.",
        },
    },
    {
        left: {
            icon: <Monitor size={26} strokeWidth={1.5} />,
            title: "Personalized Portfolio",
            description:
                "Each portfolio is tailored to your risk profile, ensuring allocations align with your financial behavior and investment goals.",
        },
        right: {
            icon: <ChartColumnIncreasing size={26} strokeWidth={1.5} />,
            title: "Balanced Risk & Return",
            description:
                "Portfolios are optimized to maximize expected returns while keeping risk within your acceptable threshold.",
        },
    }
];