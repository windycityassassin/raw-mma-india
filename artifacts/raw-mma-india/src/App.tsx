import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavBar from "@/components/NavBar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Ecosystem from "@/pages/ecosystem";
import TVShow from "@/pages/tv-show";
import FighterPipeline from "@/pages/fighter-pipeline";
import Sponsorship from "@/pages/sponsorship";
import Investors from "@/pages/investors";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/tv-show" component={TVShow} />
        <Route path="/fighter-pipeline" component={FighterPipeline} />
        <Route path="/sponsorship" component={Sponsorship} />
        <Route path="/investors" component={Investors} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
