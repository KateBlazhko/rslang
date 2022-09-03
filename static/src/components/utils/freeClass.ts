const addClassOnPage = (node: HTMLElement, group: number) => {
  switch (group) {
    case 0:
      node.classList.add('one-group');
      break;
    case 1:
      node.classList.add('two-group');
      break;
    case 2:
      node.classList.add('three-group');
      break;
    case 3:
      node.classList.add('four-group');
      break;
    case 4:
      node.classList.add('five-group');
      break;
    case 5:
      node.classList.add('six-group');
      break;
    default:
      node.classList.add('');
  }
};

export default addClassOnPage;
