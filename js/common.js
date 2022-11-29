const members = await fetch("../json/members.json").then(toJSON);
const categorys = await fetch("../json/categorys.json").then(toJSON);
const posts = await fetch("../json/posts.json").then(toJSON);

const rowLimit = 20;
let currentRow = 0;

const $galleryContainer = document.querySelector(".gallery .item-container");
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
    $galleryContainer.append($galleryItem);
}

renderGallerys();
