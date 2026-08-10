import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";


interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({children,}:MainLayoutProps){
    return(

        <div className="min-h-screen bg-gray-100">

            <AppHeader />

            <div className="flex">
                
                <AppSidebar />
                <main className="flex-1 p-8">
                    {children}
                </main>

            </div>

        </div>

    );
}