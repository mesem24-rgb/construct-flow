import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


export default function Appshell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            <Sidebar />
            <main className="flex-1">
            <Topbar />
            <div className="p-6">{children}</div>
            </main>
        </div>
    );
}