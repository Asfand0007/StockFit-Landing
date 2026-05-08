import Hero from "../components/home/Hero";
import Navbar from "../components/global/Navbar";
import WorksSection from "../components/home/WorksSection";
import WhySection from "../components/home/WhySection";
import Footer from "../components/home/Footer";

export default function Home() {
    return (
        <main>
            <Navbar animateIn={true} />
            <Hero animateIn={true} />
            <WorksSection animateIn={true} />
            <WhySection />
            <Footer animateIn={true} />
        </main>
    );
}