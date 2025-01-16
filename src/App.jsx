import { useCallback, useState } from 'react';
import './App.css';
import MemoContainer from './components/MemoContainer';
import SideBar from './components/SideBar/index.jsx';
import { setItem, getItem } from './lib/storage.jsx';
import debounce from 'lodash.debounce';

const debouncedSetItem = debounce(setItem, 5000);

function App() {
  const [memos, setMemos] = useState(getItem('memo') || []); // 예외처리

  const [selectedMemoIndex, setSelectedMemoIndex] = useState(0); // 첫번째 인덱스

  const setMemo = useCallback(
    (newMemo) => {
      setMemos((memos) => {
        const newMemos = [...memos];

        newMemos[selectedMemoIndex] = newMemo;
        debouncedSetItem('memo', newMemos); // lib의 storage.jsx로 분리함
        // localStorage.setItem('memo', JSON.stringify(newMemos));
        return newMemos;
      });
    },
    [selectedMemoIndex],
  ); // 리렌더링 될 때마다 호출되는 것을 방지하기 위해 useCallback
  // [] : dependendy list 이게 바뀌는 경우 리렌더링을 할 때 이 함수도 다시 만든다

  const addMemo = useCallback(() => {
    setMemos((memos) => {
      const now = new Date().getTime();
      const newMemos = [
        ...memos,
        {
          title: 'untitled',
          content: '',
          createdAt: now,
          updatedAt: now,
        },
      ];

      debouncedSetItem('memo', newMemos); // lib의 storage.jsx로 분리함
      return newMemos;
    });
    setSelectedMemoIndex(memos.length);
  }, [memos]);

  const deleteMemo = useCallback(
    (index) => {
      setMemos((memos) => {
        const newMemos = [...memos];
        newMemos.splice(index, 1);
        debouncedSetItem('memo', newMemos);
        return newMemos;
      });
      if (index === selectedMemoIndex) {
        setSelectedMemoIndex(0);
      } else if (index < selectedMemoIndex) {
        setSelectedMemoIndex(selectedMemoIndex - 1); // 삭제하는 것이 지금 현재 클릭한 것보다 더 앞에 있을 때
      }
    },
    [selectedMemoIndex],
  );

  return (
    <div className="App">
      <SideBar
        memos={memos}
        addMemo={addMemo}
        setSelectedMemoIndex={setSelectedMemoIndex}
        selectedMemoIndex={selectedMemoIndex}
        deleteMemo={deleteMemo}
      />
      <MemoContainer memo={memos[selectedMemoIndex]} setMemo={setMemo} />
    </div>
  );
}

export default App;
