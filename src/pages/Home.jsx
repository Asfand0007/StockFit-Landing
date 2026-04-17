import Hero from "../components/home/Hero";
import Navbar from "../components/global/Navbar";
import WorksSection from "../components/home/WorksSection";
import WhySection from "../components/home/WhySection";

export default function Home({ heroReady = false }) {
    return (
        <main>
            <Navbar animateIn={heroReady} />
            <Hero animateIn={heroReady} />
            <WorksSection animateIn={heroReady} />
            <WhySection />
        </main>
    );
}