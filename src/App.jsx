import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Logig/Home';

import './App.css';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;