import { useContext } from 'react';
import { SearchContext } from '../../App';
import styles from './search.module.scss';

function Search() {
	const { searchValue, setSearchValue } = useContext(SearchContext);
	return (
		<div className={styles.root}>
			<svg
				className={styles.icon}
				enableBackground='new 0 0 32 32'
				id='Editable-line'
				version='1.1'
				viewBox='0 0 32 32'
				xmlns='http://www.w3.org/2000/svg'
			>
				<circle
					cx='14'
					cy='14'
					fill='none'
					id='XMLID_42_'
					r='9'
					stroke='#000000'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeMiterlimit='10'
					strokeWidth='2'
				/>
				<line
					fill='none'
					id='XMLID_44_'
					stroke='#000000'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeMiterlimit='10'
					strokeWidth='2'
					x1='27'
					x2='20.366'
					y1='27'
					y2='20.366'
				/>
			</svg>
			<input
				className={styles.input}
				type='text'
				placeholder='Поиск пиццы...'
				value={searchValue}
				onChange={e => setSearchValue(e.target.value)}
			/>
			{searchValue && (
				<svg
					className={styles.clearIcon}
					style={{
						fill: 'none',
						stroke: '#000',
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeWidth: '2px',
					}}
					viewBox='0 0 32 32'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g id='cross'>
						<line className='cls-1' x1='7' x2='25' y1='7' y2='25' />
						<line className='cls-1' x1='7' x2='25' y1='25' y2='7' />
					</g>
				</svg>
			)}
		</div>
	);
}

export default Search;
