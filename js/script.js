ready(function(){

  // В этом месте должен быть написан ваш код

  const burgerButton = document.querySelector('.burger');//кнопка мобильного меню
  const mainNav = document.getElementById('nav');// блок с меню
  const filters = document.getElementById('filters');//блок с фильтрами
  const filtersButton = document.getElementById('filters-trigger');// кнопка открывания/закрывание фильтров
  const modalBlock = document.getElementById('modal-book-view');// блок с модалкой
  const modalCloseButton = document.querySelector('.modal__close');// кнопка закрытия модального окна
  let booksList = null;

  //Открываем/закрываем мобильное меню по клику
  burgerButton.addEventListener('click', function(e){
    e.preventDefault();
    burgerButton.classList.toggle('burger--close');
    mainNav.classList.toggle('main-nav--open');
  });

  //Открываем/закрываем фильтры по клику
  filtersButton.addEventListener('click', function(e){
    e.preventDefault();
    filters.classList.toggle('filters--open');
  });

  // Закрыть модальное окно
  document.addEventListener('click', function(e){
    if(e.target.classList.contains('modal__close')||e.target.classList.contains('modal--open')){
      document.getElementById('modal-book-view').classList.remove('modal--open');
      document.getElementsByTagName('html')[0].classList.remove('js-modal-open')
    }
  })
  // modalCloseButton.addEventListener('click', function(e){
  //   e.preventDefault();
  //   modalBlock.classList.toggle('modal--open');
  //   document.querySelector('.js').classList.toggle('js-modal-open')
  // });



  //попытка сделать закрытие модального окна по клику на фон за пределами модалки
  if(document.querySelector('.js').classList.contains('js-modal-open')){
    modalBlock.addEventListener('click', function(e){
    e.preventDefault()
    modalBlock.classList.toggle('modal--open');
    document.querySelector('.js').classList.toggle('js-modal-open')
    })
  }

  //Запрос данных
  function fetchBooks() {
    return fetch('https://books.marinintim.com/books').then(r=> r.json())
  }

  //Рендер карточек товаров
  const templateCard = document.querySelector('.template-card');
  const fragment = document.createDocumentFragment()

  function renderCard(books, type = 'marketing') {
    books.forEach(function(book){
      if(book.type == type) {//вывод книг по маркетингу т.к. по умолчанию активен этот таб
        const newBookCard = templateCard.content.cloneNode(true)
        newBookCard.querySelector('.card__title').textContent = book.name
        newBookCard.querySelector('.card__price').textContent = book.price/100 + ' ₽'
        newBookCard.querySelector('.card__img')
        // .src = 'https://books.marinintim.com' + book.thumb_url
        // newBookCard.querySelector('.card__img').alt = book.name
        // console.log(book.type)
        fragment.appendChild(newBookCard)
      }
    })
  }

  //попытка по клику на таб менять запрос на выведение карточек книг по типу книги
  document.querySelector('.page-header__book-tabs').addEventListener('click', function(e){
    e.preventDefault();
    console.log(e.target.dataset.type)
    // fetchBooks().then(function (){renderCard(this,e.target.dataset.type)}).then(appendChildFragment)
  })
  // let typeBook = 'marketing'
  // function setTypeFilter(){
  //   const tabsFilter = document.querySelector('.tabs__item-link')
  //   tabsFilter.addEventListener('click', function(e){
  //     e.preventDefault()
  //     console.log(tabsFilter.textContent)
  //   })
  //   if (tabsFilter == 'Маркетинг'){
  //     typeBook = 'marketing'
  //   }
  //   else if (tabsFilter == 'Научпоп') {
  //     typeBook = 'science'
  //   }
  //   else if(tabsFilter == 'Бизнес'){
  //     typeBook = 'business'
  //   }
  //   else if(tabsFilter == 'Дизайн'){
  //     typeBook = 'creativity'
  //   }

  // }


  //Выгрузка карточек товаров на страницу
  const catalogBooksList = document.querySelector('.catalog__books-list')

  function appendChildFragment(){
    catalogBooksList.innerHTML = '';
    catalogBooksList.appendChild(fragment);
  }

  //Запрос данных => Рендер карточек товаров => Выгрузка карточек товаров на страницу
  fetchBooks()
    .then(renderCard)
    .then(appendChildFragment);

// Отмена дефолтного поведения при клике на карточку товара
  const cardLink = document.querySelector('.card__inner');

  const templateModal = document.querySelector('.template-modal')


  //попытка создать модальное окно при клике на карточку книги
  catalogBooksList.addEventListener('click', function(e){
    e.preventDefault();
    // const newModal = templateModal.content.cloneNode(true);
    // const pageContent = document.querySelector('.page__content')
    // newModal.querySelector('.product__title').textContent = document.querySelector('.card__title').textContent
    // fragment.appendChild(newModal)
    // pageContent.appendChild(fragment)
    document.querySelector('.modal').classList.add('modal--open')
    document.querySelector('.js').classList.add('js-modal-open')
  })


  // ВНИМАНИЕ!
  // Нижеследующий код (кастомный селект и выбор диапазона цены) работает
  // корректно и не вызывает ошибок в консоли браузера только на главной.
  // Одна из ваших задач: сделать так, чтобы на странице корзины в консоли
  // браузера не было ошибок.

  // Кастомные селекты (кроме выбора языка)
  new Choices('.field-select:not(#lang) select.field-select__select', {
    searchEnabled: false,
    shouldSort: false,
  });
  // Кастомный селект выбора языка отдельно
  new Choices('#lang select.field-select__select', {
    searchEnabled: false,
    shouldSort: false,
    callbackOnCreateTemplates: function (template) {
      return {
        item: (classNames, data) => {
          return template(`
            <div class="${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>
              ${getLangInSelectIcon(data.value)} ${data.label.substr(0,3)}
            </div>
          `);
        },
        choice: (classNames, data) => {
          return template(`
            <div class="${classNames.item} ${classNames.itemChoice} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}" data-select-text="${this.config.itemSelectText}" data-choice ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'} data-id="${data.id}" data-value="${data.value}" ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}>
              ${getLangInSelectIcon(data.value)} ${data.label}
            </div>
          `);
        },
      };
    }
  });
  function getLangInSelectIcon(value) {
    if (value == 'ru') return '<span class="field-select__lang-ru"></span>';
    else if (value == 'en') return '<span class="field-select__lang-en"></span>';
    return '<span class="field-select__lang-null"></span>';
  }

  // Выбор диапазона цен
  var slider = document.getElementById('price-range');
  noUiSlider.create(slider, {
    start: [400, 1000],
    connect: true,
    step: 100,
    range: {
      'min': 200,
      'max': 2000
    }
  });

});

function ready (fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
