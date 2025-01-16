import './index.css';
function MemoItem({ children, onClickItem, onClickDelete, isSelected }) {
  //children은 React 컴포넌트의 기본 props 중 하나로, 컴포넌트 태그 사이에 전달된 내용. children은 React에서 예약된 prop 이름
  return (
    <div
      className={'MemoItem' + (isSelected ? ' selected' : '')}
      onClick={onClickItem}
    >
      {children}
      <button className="MemoItem__delete-button" onClick={onClickDelete}>
        X
      </button>
    </div>
  );
}

export default MemoItem;
