import './App.css';
import {Provider} from "react-redux";
import store from "./store/store";
import GamesContainer from "./components/Games/GamesContainer";
import Header from "./components/Header/Header";

const App = () => {
  return (
      <div className="App">
        <header>
            <Header />
        </header>
        <main>
            <GamesContainer />
        </main>
      </div>
  );
}

const AppWrapper = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

export default AppWrapper
