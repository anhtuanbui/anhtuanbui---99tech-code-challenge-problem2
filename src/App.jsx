import { Suspense, lazy } from "react";
import "./App.scss";

const LazyForm = lazy(() => import("./Form/Form"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <LazyForm />
      </Suspense>
    </div>
  );
}

export default App;
