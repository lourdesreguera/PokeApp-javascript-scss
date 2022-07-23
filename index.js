const cardsContainer$$ = document.querySelector('[data-fn="b-card-container"]');
const div$$ = document.querySelectorAll('.b-card-container__card');
const searchInput$$ = document.querySelector('[data-fn="b-search__input"]');
const searchBtn$$ = document.querySelector('[data-fn="b-search__btn"]');
const moreBtn$ = document.createElement('button');
moreBtn$.textContent= 'View more';
moreBtn$.classList.add('box');
moreBtn$.classList.add('box--btn-hide')

let countPage = 0;



const callApi =  () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${countPage}&limit=20`)
        .then(res => res.json())
        .then(pokemons => {printPokemonsCards(pokemons.results)})    
}
callApi();


const printPokemonsCards = pokemons => {
    for (const pokemon of pokemons) {
        printOnePokemon(pokemon);
    } 
}

const printOnePokemon = (pokemon) => {
    const div$$ = document.createElement('div');
    div$$.classList.add('b-card-container__card');
    div$$.classList.add('box');
    div$$.innerHTML = `<h2>${pokemon.name}</h2>`;
    div$$.setAttribute('id', pokemon.name);
    callApiImgs(div$$)
    
    cardsContainer$$.appendChild(div$$);
    cardsContainer$$.appendChild(moreBtn$);
    div$$.addEventListener('click', () => showDesc(div$$))
}

const callApiImgs = (div) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${div.id}/`)
        .then(res => res.json())
        .then(pokemonsImg => {printPokemonsImg(pokemonsImg.sprites, div)})
}

const printPokemonsImg = (pokemon, div) => {
    const img$$ = document.createElement('img');
    img$$.setAttribute('src', pokemon.front_default);
    div.appendChild(img$$);   
}

const showDesc = (div$$) => {
    const divContainer$$ = document.createElement('div');
    const ul$$ = document.createElement('ul');
    const firstLi$$ = document.createElement('li');
    const secLi$$ = document.createElement('li');
    firstLi$$.textContent = 'Description';
    secLi$$.textContent = 'Stats';



    secLi$$.addEventListener('click', (e) =>{ 
        e.stopPropagation(); 
        showStats(divContainer$$, div$$)});



    ul$$.appendChild(firstLi$$);
    ul$$.appendChild(secLi$$);
    divContainer$$.appendChild(ul$$);
    divContainer$$.classList.add('b-description__container')
    
    div$$.appendChild(divContainer$$)
    
    callApiBio(div$$, divContainer$$);
}






const showStats = (divContainer, div) => {
    divContainer.innerHTML = ''
    callApiStats(div, divContainer);
}
const printPokemonsStats = (pokemons, divContainer) => {
    const divContainer$$ = document.createElement('div');
    const ul$$ = document.createElement('ul');
    const firstLi$$ = document.createElement('li');
    const secLi$$ = document.createElement('li');
    firstLi$$.textContent = 'Description';
    secLi$$.textContent = 'Stats';
    ul$$.appendChild(firstLi$$);
    ul$$.appendChild(secLi$$);
    divContainer$$.appendChild(ul$$);
    divContainer.appendChild(divContainer$$)

    for (const stat of pokemons.stats) {
        const globalDiv$$ = document.createElement('div');
        globalDiv$$.innerHTML = `
            <div class="progress-container">
                <div class=""progress-bar style="
                background-color: white;
                width: ${stat.base_stat}%;
                height: 20px;
                border-radius: 5px;
            "></div>
            </div>
            <div class="progress-text"><p>${stat.stat.name}: ${stat.base_stat}</p></div>
        `    
        divContainer$$.appendChild(globalDiv$$)
    }

    const divHide$$ = document.createElement('button');
    divHide$$.classList.add('box');
    divHide$$.classList.add('box--btn-hide');
    divHide$$.textContent = 'Hide description';
    divContainer$$.appendChild(divHide$$);
    
    divHide$$.addEventListener('click', (e) =>{ 
        e.stopPropagation(); 
        hide(divContainer$$)});

}

const callApiStats = (div, divContainer) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${div.id}/`)
        .then(res => res.json())
        .then(pokemonsStats => {printPokemonsStats(pokemonsStats, divContainer)})
}




const printPokemonsBio = (pokemons, divContainer$$) => {
    const globalDiv$$ = document.createElement('div');
    const divBiodata$$ = document.createElement('div');
    divBiodata$$.classList.add('b-description__container--biodata');
    divBiodata$$.innerHTML = `
        <h3 class="heading-card">Biodata</h3>
        <h4 class="subheading-card">Name:</h4>
        <p class="p-card p-card--upper">${pokemons.name}</p>
        <h4 class="subheading-card">Height</h4>
        <p class="p-card">${(pokemons.height) * 10} cm</p>
        <h4 class="subheading-card">Weight</h4>
        <p class="p-card">${(pokemons.height) / 10} kg</p>
    `

    const divTypes$$ = document.createElement('div');
    divTypes$$.innerHTML = `
        <h3 class="heading-card">Types</h3>
    `
    divTypes$$.classList.add('b-description__container--types')
    const divTypesBtn$$ = document.createElement('div');
    
    for (const type of pokemons.types) {
        const p$$ = document.createElement('p');
        p$$.innerHTML = type.type.name;
        p$$.classList.add('type-card');
        divTypesBtn$$.appendChild(p$$)
    }

    const divHide$$ = document.createElement('button');
    divHide$$.classList.add('box');
    divHide$$.classList.add('box--btn-hide');
    divHide$$.textContent = 'Hide description';    

    globalDiv$$.appendChild(divBiodata$$);    
    divTypes$$.appendChild(divTypesBtn$$);
    globalDiv$$.appendChild(divTypes$$);
    globalDiv$$.appendChild(divHide$$);
    divContainer$$.appendChild(globalDiv$$);
    divHide$$.addEventListener('click', (e) =>{ 
        e.stopPropagation(); 
        hide(divContainer$$)});
}

const callApiBio = (div, divContainer$$) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${div.id}/`)
        .then(res => res.json())
        .then(pokemonsBio => {printPokemonsBio(pokemonsBio, divContainer$$)})
}

const hide = (div) => {
    div.remove();
}

const search = () => {
    cardsContainer$$.innerHTML = '';
    
    const filterPokemon = pokemons => {
        const pokemonFound = pokemons.results. find(pokemon => pokemon.name.includes(searchInput$$.value));
        printOnePokemon(pokemonFound);
        moreBtn$.remove();
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1154`)
        .then(res => res.json())
        .then(pokemons => filterPokemon(pokemons))


    const backBtn$$ = document.createElement('button');
    backBtn$$.innerHTML = '<img src="assets/arrow.svg">';
    backBtn$$.classList.add('back-btn')
    cardsContainer$$.appendChild(backBtn$$)
    backBtn$$.addEventListener('click', () => { 
        backBtn$$.remove(); 
        cardsContainer$$.innerHTML = '';
        callApi();})    
}

searchBtn$$.addEventListener('click', search);

const showOtherPage = () => {
    countPage += 20;
    callApi()
}

moreBtn$.addEventListener('click', showOtherPage);