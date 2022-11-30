const members = await fetch("../json/members.json").then(toJSON);
const categorys = await fetch("../json/categorys.json").then(toJSON);
const posts = await fetch("../json/posts.json").then(toJSON);
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

const rowLimit = 20;
let currentRow = 0;

const $galleryModal = document.querySelector(".gallery-modal");
const $galleryContainer = document.querySelector(".gallery .item-container");
const $memberFilter = document.querySelector(".member-filter");
const $categoryFilter = document.querySelector(".category-filter");
const services = {
    findMember(findMemberIndex) {
        return members.find(({ index }) => findMemberIndex === index);
    },
    findCategory(findCategoryIndex) {
        return categorys.find(({ index }) => findCategoryIndex === index);
    },
};

window.addEventListener("scroll", function () {
    const domHeight = document.body.clientHeight;
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;
    if (winHeight + scrollY > domHeight - 120) {
        currentRow++;
        renderGallerys();
    }
});

function renderGallerys() {
    const currentPosts = posts.slice(
        rowLimit * currentRow,
        rowLimit * currentRow + rowLimit
    );
    currentPosts.forEach(renderGalleryItem);
}
function renderGalleryItem(gallery) {
    const $galleryItem = document.createElement("div");
    const member = services.findMember(gallery.memberIndex);

    $galleryItem.className = "item";
    $galleryItem.innerHTML = `
        <div class="background"></div>
        <div class="text-wrap">
            <p class="title">${gallery.title}</p>
            <p class="description">${gallery.contents}</p>
        </div>
        <div class="item-footer">
            <p class="user">by <span>${member.name}</span></p>
            <p class="date">${gallery.date}</p>
        </div>
    `;
    $galleryItem.addEventListener("click", function () {
        console.log("1");
        setModalContent(gallery);
        modalOpen();
    });
    $galleryContainer.append($galleryItem);
}

function setModalContent(gallery) {
    const $galleryModal = document.querySelector(".gallery-modal");
    const $title = $galleryModal.querySelector(".title");
    const $description = $galleryModal.querySelector(".description");
    const $categorys = $galleryModal.querySelector(".categorys");
    const $user = $galleryModal.querySelector(".user>span");
    const $date = $galleryModal.querySelector(".date");

    const member = services.findMember(gallery.memberIndex);
    const categorys = gallery.categorys.map(services.findCategory);
    $title.textContent = gallery.title;
    $description.textContent = gallery.contents;
    $user.textContent = member.name;
    $date.textContent = gallery.date;
    $categorys.innerHTML = categorys
        .map(
            ({ color, name }) =>
                `<span class="category" style="background:${color}">#${name}</span>`
        )
        .join("");
}
function modalOpen() {
    const $galleryModal = document.querySelector(".gallery-modal");
    $galleryModal.classList.add("open");
}
function modalClose() {
    const $galleryModal = document.querySelector(".gallery-modal");
    $galleryModal.classList.remove("open");
}

$galleryModal.addEventListener("click", function (e) {
    modalClose();
});

const c = $galleryModal.querySelector(".modal-content");
c.addEventListener("click", function (e) {
    e.stopPropagation();
});
renderGallerys();
