const search_btn = document.querySelector('.search_button');
const search_bar = document.querySelector('#search_text');
const result = document.querySelector('.result_text');
const recent_cont = document.querySelector('.recent_container');
// const recent_searches = document.querySelectorAll('.recent_search');

let recent_words = [];
let recent_definitions = [];

search_btn.addEventListener('click', () => {
  const search_txt = search_bar.value;
  getMeaning(search_txt);
});

function update_recents(pos) {
  if (pos == 0) {
    recent_cont.removeChild(recent_cont.children[0]);
  }
  const recent_search = document.createElement('div');
  recent_search.setAttribute('class', 'recent_search');
  recent_search.addEventListener('click', () => {
    getMeaning(recent_words[pos]);
  });
  const recent_word = document.createElement('h2');
  recent_word.textContent = recent_words[pos];
  const recent_definition = document.createElement('p');
  recent_definition.setAttribute('class', 'recent_definition');
  recent_definition.textContent = recent_definitions[pos];
  recent_search.appendChild(recent_word);
  recent_search.appendChild(recent_definition);
  recent_cont.appendChild(recent_search);
}

async function getMeaning(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    const definitions = data[0].meanings;
    result.textContent = '';
    for (let i = 0; i < definitions.length; ++i) {
      const part_result = document.createElement('div');
      part_result.setAttribute('class', 'part_result');
      const definition_heading = document.createElement('h2');
      definition_heading.textContent = `Definition ${i + 1} :`;

      const definition_text = document.createElement('p');
      definition_text.textContent = definitions[i].definitions[0].definition;

      const example_heading = document.createElement('h3');
      example_heading.textContent = `Example :`;

      const example_text = document.createElement('p');
      example_text.style.setProperty('font-size', '0.9rem');
      example_text.textContent = definitions[i].definitions[0].example;

      part_result.appendChild(definition_text);

      if (definitions[i].definitions[0].example) {
        part_result.appendChild(example_heading);
        part_result.appendChild(example_text);
      }
      result.appendChild(part_result);
    }
    if (recent_words.length < 5 && !recent_words.includes(word)) {
      recent_words.push(word);
      recent_definitions.push(definitions[0].definitions[0].definition);
      update_recents(recent_words.length - 1);
    } else if (recent_words.length === 5 && !recent_words.includes(word)) {
      recent_words[0] = word;
      recent_definitions[0] = definitions[0].definitions[0].definition;
      update_recents(0);
    }
  } catch (error) {
    result.textContent = 'the word does not exist';
    console.log(error);
  }
}
