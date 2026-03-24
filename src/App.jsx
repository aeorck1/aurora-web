import { AuroraProvider, useAurora } from "./store/AuroraContext";
import NavBar from "./layouts/NavBar";
import SiteFooter from "./layouts/SiteFooter";
import { LandingPage, ChatPage, JournalPage } from "./pages";



const PAGE_MAP = {
  landing: <LandingPage />,
  chat: <ChatPage />,
  journal: <JournalPage />,
};

function AuroraApp() {
  const { currentPage } = useAurora();
  return (
    <>
      <NavBar />
      <main style={{ position: "relative" }}>
        {PAGE_MAP[currentPage] ?? <LandingPage />}
      </main>
      <SiteFooter />
    </>
  );
}

//  Root 
export default function Aurora() {
  return (
    <AuroraProvider>
      <AuroraApp />
    </AuroraProvider>
  );
}
