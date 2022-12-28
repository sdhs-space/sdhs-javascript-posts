const sortDateDESC = (a, b) => new Date(b.date) - new Date(a.date);
const $postContainer = findElement(".posts .item-container");
const $detailPostDialog = findElement(".detail-post__dialog");
const $filterPostDialog = findElement(".filter-post__dialog");

const datas = {
  categorys: await $fetch("/json/categorys.json"),
  members: await $fetch("/json/members.json"),
  posts: await $fetch("/json/posts.json"),
  all: [],
};
const services = {
  findMember(findMemberIndex) {
    return datas.members.find(({ index }) => index === findMemberIndex);
  },
  findAllCategory(categorys) {
    return categorys.map(this.findCategory);
  },
  findCategory(findCategoryIndex) {
    return datas.categorys.find(({ index }) => index === findCategoryIndex);
  },
};
const state = {
  findPosts: [],
  post: {
    currentIndex: 0,
    limit: 20,
    maxIndex: 0,
    guard() {
      return this.currentIndex + 1 >= this.maxIndex;
    },
  },
  hotKeys: {
    boolean: {},
    description: {
      SHIFT: 16,
      CONTROL: 17,
    },
  },
};
const modalState = {
  detailPost: modalAPI($detailPostDialog),
  filterPost: modalAPI($filterPostDialog),
  detailPostElements: {
    $background: findElement(".background", $detailPostDialog),
    $title: findElement(".title", $detailPostDialog),
    $description: findElement(".description", $detailPostDialog),
    $categorys: findElement(".categorys", $detailPostDialog),
    $memberName: findElement(".member-name span", $detailPostDialog),
    $createDate: findElement(".create-date", $detailPostDialog),
  },
  filterPostElements: {
    $memberNameInput: findElement(".member-name__input", $filterPostDialog),
    $categoryInput: findElement(".category__input", $filterPostDialog),
    $categoryBox: findElement(".categorys", $filterPostDialog),
    $closeButton: findElement(".close-btn", $filterPostDialog),
    $succesButton: findElement(".success-btn", $filterPostDialog),
  },
  filterPostDatas: {
    memberName: "",
    categorys: [],
  },
};

// 필터링 & ctrl + shift 조건 검색 예외처리 및 화면 예외처리 & header 제목 추가하기
window.addEventListener("scroll", function () {
  if (state.post.guard()) return;
  const { innerHeight, scrollY } = window;
  const { scrollHeight } = document.body;
  if (scrollY + innerHeight >= scrollHeight - 100) {
    renderPost();
  }
});
modalState.filterPostElements.$closeButton.addEventListener("click", modalState.filterPost.close);
modalState.filterPostElements.$succesButton.addEventListener("click", function () {
  const { $memberNameInput } = modalState.filterPostElements;
  modalState.filterPostDatas.memberName = $memberNameInput.value;
  $postContainer.innerHTML = "";
  state.post.currentIndex = 0;
  state.findPosts = datas.all.filter(({ member, categorys }) => {
    const { memberName, categorys: fcategorys } = modalState.filterPostDatas;
    const mapCategorys = categorys.map(({ name }) => name);
    const existMemberName = !memberName.length || memberName === member.name;
    const existCategoryName = fcategorys.every((categoryName) => mapCategorys.includes(categoryName));

    return existMemberName && existCategoryName;
  });
  modalState.filterPost.close();
  renderPost();
});
modalState.filterPostElements.$categoryInput.addEventListener("keydown", function (event) {
  const keyCode = event.keyCode;
  const isCreateCateogry = [13, 32].includes(keyCode);
  const value = this.value.trim();
  if (isCreateCateogry && value.length) {
    this.value = "";
    modalState.filterPostDatas.categorys.push(value);

    const { $categoryBox } = modalState.filterPostElements;
    const $category = createElement("span");
    const $categoryDeleteButton = createElement("button");
    $category.className = "category";
    $category.textContent = `#${value}`;
    $categoryDeleteButton.textContent = "X";
    $categoryDeleteButton.addEventListener("click", function () {
      modalState.filterPostDatas.categorys = modalState.filterPostDatas.categorys.filter((categoryName) => categoryName !== value);
      $category.remove();
    });
    $category.append($categoryDeleteButton);
    $categoryBox.append($category);
  }
});
document.addEventListener("keydown", function (e) {
  state.hotKeys.boolean[e.which] = true;
  const isDownShift = state.hotKeys.boolean[state.hotKeys.description.SHIFT];
  const isDownControl = state.hotKeys.boolean[state.hotKeys.description.CONTROL];

  if (isDownShift && isDownControl) {
    modalState.filterPost.open();
    setFilterPostDialogContent();
  }
});
document.addEventListener("keyup", function (e) {
  state.hotKeys.boolean[e.which] = false;
});

function createPostElement(postData) {
  const $post = createElement("div");
  $post.className = "item";
  $post.innerHTML = `
        <div class="item-head">
            <div class="background"></div>
        </div>
        <div class="item-body">
            <p class="title">${postData.title}</p>
            <p class="description text-ellipsis">${postData.contents}</p>
        </div>
        <div class="item-footer flex">
            <p class="member-name">
                by <span>${postData.member.name}</span>
            </p>
            <p class="create-date">${postData.date}</p>
        </div>
    `;
  return $post;
}

function appendPostElement(postData) {
  const $post = createPostElement(postData);
  $post.addEventListener("click", function () {
    modalState.detailPost.open();
    setDetailPostDialogContent(postData);
  });
  $postContainer.append($post);
}
function setDetailPostDialogContent(postData) {
  const { $background, $title, $description, $categorys, $memberName, $createDate } = modalState.detailPostElements;
  $title.textContent = postData.title;
  $description.textContent = postData.contents;
  $memberName.textContent = postData.member.name;
  $createDate.textContent = postData.date;
  $categorys.innerHTML = "";
  postData.categorys.forEach((category) => {
    const $category = createElement("span");
    $category.className = "category";
    $category.textContent = `#${category.name}`;
    $category.style.background = category.color;
    $categorys.append($category);
  });
}
function setFilterPostDialogContent() {
  const { $memberNameInput, $categoryBox } = modalState.filterPostElements;
  const { memberName, categorys } = modalState.filterPostDatas;

  $memberNameInput.value = memberName;
  $categoryBox.innerHTML = "";
  categorys.forEach((category) => {
    const $category = createElement("span");
    const $categoryDeleteButton = createElement("button");
    $category.className = "category";
    $category.textContent = `#${category}`;
    $categoryDeleteButton.textContent = "X";
    $categoryDeleteButton.addEventListener("click", function () {
      modalState.filterPostDatas.categorys = modalState.filterPostDatas.categorys.filter((categoryName) => categoryName !== category);
      $category.remove();
    });
    $category.append($categoryDeleteButton);
    $categoryBox.append($category);
  });
}

function renderPost() {
  const { currentIndex, limit } = state.post;
  const startIndex = currentIndex * limit;
  const endIndex = startIndex + limit;
  state.findPosts.sort(sortDateDESC);
  state.findPosts.slice(startIndex, endIndex).forEach(appendPostElement);
  state.post.currentIndex++;
}

function init() {
  datas.all = datas.posts.map((postData) => {
    const member = services.findMember(postData.memberIndex);
    const categorys = services.findAllCategory(postData.categorys);
    return {
      ...postData,
      member,
      categorys,
    };
  });
  datas.posts.sort(sortDateDESC); // 게시글 최신순으로 정렬
  state.post.maxIndex = Math.ceil(datas.posts.length / state.post.limit);
  state.findPosts = datas.all;
  renderPost();
}

init();
