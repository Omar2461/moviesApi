const createAutoComplete = ({root,renderOption,onOptionSelect,inputValue,fetchData}) => {

  root.innerHTML = `
<labell><b>Search</b></label>
<input type='text' class='input'></input>
<div class="dropdown">
<div class="dropdown-menu">
<div class="dropdown-content">

</div>
</div>
</div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".dropdown-content");

  const onInput = debounce(async (e) => {
    const title = e.target.value;
    resultsWrapper.innerHTML = "";
    const items = await fetchData(title);

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    for (let item of items) {
      dropdown.classList.add("is-active");
      const a = document.createElement("a");
      a.classList.add("dropdown-item");
      a.innerHTML = renderOption(item);
      a.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      resultsWrapper.appendChild(a);
    }
  }, 500);
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
  input.addEventListener("input", onInput);
};
