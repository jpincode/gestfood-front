import Header from "../components/ui/header/Header";
import Footer from "../components/ui/footer/Footer";
import { Outlet } from "react-router-dom";

function Main() {
  return (
    <>
      <Header></Header>
      <main>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </>
  );
}

export default Main;
