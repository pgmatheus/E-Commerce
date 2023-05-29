import Product from "./pages/Product";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Purchases from "./pages/Purchases";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import Success from "./pages/Success";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Activation from "./pages/Activation";
import { useState, useEffect } from "react";
import NotFound from "./pages/NotFound";

const App = () => {
	const user = useSelector((state) => state.user.currentUser);
	const [categoriesGet, setCategoriesGet] = useState(undefined);
	return (
		<Router>
			<Navbar
				categoriesGet={categoriesGet}
				setCategoriesGet={setCategoriesGet}
			/>
			<Switch>
				<Route exact path="/">
					<Home
						categoriesGet={categoriesGet}
						setCategoriesGet={setCategoriesGet}
					/>
				</Route>

				<Route path="/products/">
					<ProductList categoriesGet={categoriesGet} />
				</Route>
				<Route path="/product/:id">
					<Product categoriesGet={categoriesGet} />
				</Route>
				<Route path="/cart">
					<Cart categoriesGet={categoriesGet} />
				</Route>
				{/* <Route path="/success">
					<Success />
				</Route> */}
				<Route path="/checkout">
					<Checkout />
				</Route>
				<Route path="/login">
					{user ? <Redirect to="/" /> : <Login categoriesGet={categoriesGet} />}
				</Route>
				<Route path="/register">
					{user ? (
						<Redirect to="/" />
					) : (
						<Register categoriesGet={categoriesGet} />
					)}
				</Route>
				<Route path="/purchases">
					<Purchases categoriesGet={categoriesGet} />
				</Route>
				<Route path="/profile">
					<Profile />
				</Route>
				<Route path="/changepassword">
					<ChangePassword />
				</Route>
				<Route path="/activation">
					<Activation />
				</Route>
				<Route>
					<NotFound />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
