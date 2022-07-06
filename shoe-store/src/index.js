import ErrorBoundary from 'components/ErrorBoundary';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CartContextProvider } from 'hooks/useCartContext';

const container = document.getElementById('root');

ReactDOM.createRoot(container).render(
	<ErrorBoundary>
		<BrowserRouter>
			<CartContextProvider>
				<App />
			</CartContextProvider>
		</BrowserRouter>
	</ErrorBoundary>
);
