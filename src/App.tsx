import { useEffect, useState } from 'react';
import Categories from './components/Categories';
import Header from './components/Header';
import PizzaBlock from './components/PizzaBlock';
import Sort from './components/Sort';
import './scss/app.scss';

function App() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		fetch('https://68ea4faef1eeb3f856e6e022.mockapi.io/items')
			.then(response => {
				return response.json();
			})
			.then(json => {
				setItems(json);
			});
	}, []);

	return (
		<div className='wrapper'>
			<Header />
			<div className='content'>
				<div className='container'>
					<div className='content__top'>
						<Categories />
						<Sort />
					</div>
					<h2 className='content__title'>Все пиццы</h2>
					<div className='content__items'>
						{items.map(pizza => {
							return <PizzaBlock key={pizza.id} {...pizza} />;
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
