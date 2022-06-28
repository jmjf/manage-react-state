import ErrorBoundary from 'components/ErrorBoundary';
import ReactDOM from 'react-dom';
import App from './App';

const container = document.getElementById('root');

ReactDOM.createRoot(container).render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>
);
