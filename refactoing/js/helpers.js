const domAPI = () => ({
  findElement(element, parentElement = document) {
    return parentElement.querySelector(element);
  },
  findAllElement(element, parentElement = document) {
    return [...parentElement.querySelectorAll(element)];
  },
  createElement(element) {
    return document.createElement(element);
  },
});
function fetchAPI() {
  function toJSON(response) {
    return response.json();
  }
  function $fetch(path) {
    return fetch(path).then(toJSON);
  }
  return $fetch;
}
function modalAPI($dialog) {
  function open() {
    $dialog.showModal();
    document.body.classList.add("scroll-block");
  }
  function close() {
    $dialog.close();
    document.body.classList.remove("scroll-block");
  }
  $dialog.addEventListener("click", function (event) {
    if (event.target === $dialog) {
      close();
    }
  });
  return {
    open,
    close,
  };
}

const { findElement, findAllElement, createElement } = domAPI();
const $fetch = fetchAPI();
