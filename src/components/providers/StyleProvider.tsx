import Header from "@/components/Header";
import Footer from "@/components/Footer";

function StyleProvider({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gradient-to-br from-blue-100 to-purple-100">
            <Header />
            <div className='px-10 lg:px-32 xl:px-48 2xl::px-56'>
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default StyleProvider;