import { AuraProvider, useAura } from "./store/AuraContext";
import NavBar from "./layouts/NavBar";
import SiteFooter from "./layouts/SiteFooter";
import { LandingPage, ChatPage, JournalPage } from "./pages";



const PAGE_MAP = {
  landing: <LandingPage />,
  chat: <ChatPage />,
  journal: <JournalPage />,
};

function AuraApp() {
  const { currentPage } = useAura();
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
export default function Aura() {
  return (
    <AuraProvider>
      <AuraApp />
    </AuraProvider>
  );
}
