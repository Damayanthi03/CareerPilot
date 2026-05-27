import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/lib/theme";
import NotFound from "@/pages/not-found";

import Welcome from "@/pages/welcome";
import Home from "@/pages/home";
import Analyze from "@/pages/analyze";
import Results from "@/pages/results";
import Assessment from "@/pages/assessments";
import Dashboard from "@/pages/dashboard";
import Tests from "@/pages/tests";
import Coach from "@/pages/coach";
import Jobs from "@/pages/jobs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 500,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/welcome" component={Welcome} />
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/analyze" component={Analyze} />
            <Route path="/results/:id" component={Results} />
            <Route path="/assessments" component={Assessment} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/tests" component={Tests} />
            <Route path="/coach" component={Coach} />
            <Route path="/jobs" component={Jobs} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
