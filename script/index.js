const createDetails = (arr) => {
    const createElementForWord = arr.map(el => `<span class="btn mr-3 mt-3">${el}</span>`)
    return createElementForWord.join("   ");
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}


const manageSpiner = (status) => {
    if (status == true) {
        document.getElementById("spiner").classList.remove("hidden")
        document.getElementById("word-section").classList.add("hidden")
    }
    else {
        document.getElementById("word-section").classList.remove("hidden")
        document.getElementById("spiner").classList.add("hidden")
    }
}


const removeActive = () => {
    const btnRemoveAll = document.querySelectorAll(".btn-class")
    btnRemoveAll.forEach((btn) =>
        btn.classList.remove("active"))

}

// 1
const loadLevel = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(data => displayPut(data.data)
        )
}


// 2
const loadButtonWord = (id) => {
    manageSpiner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            removeActive();
            const btnClick = document.getElementById(`button-click-${id}`)
            btnClick.classList.add("active")



            wordFunction(data.data)
        }
        )
}


const wordButtonDetail = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;

    fetch(url)
        .then(res => res.json())
        .then(data => addDetailWord(data.data))
}


const addDetailWord = (detail) => {
    console.log(detail)

    const takeId = document.getElementById("word-details-box")
    takeId.innerHTML = `
               <div  class="space-y-4">
                <div class="">
                    <h3 class="font-bold bangla-font text-[25px]">${detail.word} ( <i class="fa-solid fa-microphone-lines"></i>
                        :${detail.pronunciation})</h3>
                </div>
                <div class="">
                    <h3 class="font-bold">Meaning</h3>
                </div>
                <div class="">
                    <h3 class=" bangla-font">${detail.meaning ? detail.meaning : "অর্থ পাওয়া যায় নি"}</h3>
                </div>
                <div class="">
                    <h3 class="font-bold">Example</h3>
                </div>
                <div class="">
                    <h3 class="">${detail.sentence}</h3>
                </div>
                <div class="">
                    <h3 class="font-bold bangla-font bangla-font">সমার্থক শব্দ গুলো</h3>
                    <div class="">${createDetails(detail.synonyms)}</div>
                </div>
             
            </div>
    `

    document.getElementById("word_model").showModal();


}


// 1
const displayPut = (lessons) => {
    console.log(lessons);

    const buttonDiv = document.getElementById("button-section")
    buttonDiv.innerHTML = "";

    for (let lesson of lessons) {
        const newDiv = document.createElement("div")
        newDiv.innerHTML = `
                 <button id="button-click-${lesson.level_no}" onclick="loadButtonWord(${lesson.level_no})"  class="btn btn-outline btn-primary btn-class"><i class="fa-solid fa-book-open-reader"></i>Lesson - 
                 ${lesson.level_no}</button>
        `;

        buttonDiv.appendChild(newDiv)


    }
}

// 2
const wordFunction = (elements) => {
    console.log(elements)
    const wordSection = document.getElementById("word-section")
    wordSection.innerHTML = "";

    if (elements.length === 0) {
        wordSection.innerHTML = `
            
        <div class="text-center col-span-full bangla-font bg-[#F8F8F8]">
            <img src="./assets/alert-error.png" alt="" class="mx-auto pb-7">
            <h3 class="font-medium text-[16px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</h3><br>
            <h3 class="font-bold text-[30px]">নেক্সট Lesson এ যান</h3>
        </div>

   
        
        `;
        manageSpiner(false)
        return;
    }




    for (let element of elements) {
        console.log(element)
        const newDivForWord = document.createElement("div")
        newDivForWord.innerHTML = `
                 <div class="bg-white text-center p-8 m-5 h-full">
            <h3 class="text-[25px] font-bold">${element.word ? element.word : "শব্দ পাওয়া যায় নি"}</h3>
            <p class="py-5 text-[16px] text-[#000000]">Meaning /Pronounciation</p>
            <h3 class="text-[25px] font-semibold pb-10">"${element.meaning ? element.meaning : "অর্থ পাওয়া যায় নি"
            } / ${element.pronunciation ? element.pronunciation : "Pronounciation পাওয়া যায় নি"}"</h3 >
        <div class="flex justify-between w-11/12 mx-auto gap-15 md:gap-30">
            <button onclick="wordButtonDetail(${element.id})"><i
                class="fa-solid fa-info bg-[#1a91ff1a] hover:bg-[#1A91FF] py-5   px-6 pr-8 rounded-[8px] flex justify-center items-center"></i></button>
            <button onclick="pronounceWord('${element.word}')"><i class="fa-solid fa-volume-high bg-[#1a91ff1a] hover:bg-[#1A91FF] px-5 py-5 pr-10 rounded-[8px] "></i></button>
        </div>
        </div >
    `

        wordSection.appendChild(newDivForWord)
    }
    manageSpiner(false)
}




loadLevel();


document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search")
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue)

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWord = data.data;
            console.log(allWord)
            const filterWord = allWord.filter(word => word.word.toLowerCase().includes(searchValue));
            wordFunction(filterWord)
        })
    input.value = "";
})












// another method of adding details of word
//    <div class="flex gap-5">
//                     <button class="bg-[#D7E4EF] py-2 px-5 border-none rounded-[5px]">${detail.synonyms[0]}</button>
//                     <button class="bg-[#D7E4EF] py-2 px-5 border-none rounded-[5px]">${detail.synonyms[1]}</button>
//                     <button class="bg-[#D7E4EF] py-2 px-5 border-none rounded-[5px]">${detail.synonyms[2]}</button>

//                 </div>