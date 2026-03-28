import React from 'react';
import { useStore } from '../store/useStore';
import { Moon, Sun, Trash2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useStore();

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      toast.success('계정 삭제 요청이 접수되었습니다. (UI 전용)');
    }
  };

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-x-border p-4">
        <h1 className="text-xl font-bold text-x-black">설정</h1>
      </header>

      <div className="divide-y divide-x-border">
        <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between" onClick={toggleDarkMode}>
          <div className="flex items-center gap-3">
            {isDarkMode ? <Moon className="w-5 h-5 text-x-gray" /> : <Sun className="w-5 h-5 text-x-gray" />}
            <div>
              <div className="font-bold text-[15px]">화면 모드</div>
              <div className="text-sm text-x-gray">{isDarkMode ? '다크 모드' : '라이트 모드'}</div>
            </div>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-x-blue' : 'bg-gray-300'}`}>
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isDarkMode ? 'translate-x-5' : ''}`}></div>
          </div>
        </div>

        <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between" onClick={handleDeleteAccount}>
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <div>
              <div className="font-bold text-[15px] text-red-500">계정 삭제</div>
              <div className="text-sm text-x-gray">모든 데이터가 영구적으로 삭제됩니다.</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-x-gray" />
        </div>
      </div>
    </div>
  );
}
