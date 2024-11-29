import React, { useState } from "react";
import "./UserMenu.css";

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // 메뉴 열고 닫기 토글
  };

  const handleSignOut = () => {
    alert("로그아웃 되었습니다."); // 로그아웃 동작 추가
    // 로그아웃 로직 추가 (예: 토큰 삭제, 리다이렉트 등)
  };

  return (
    <div className="user-menu">
      {/* 사용자 프로필 이미지와 클릭 이벤트 */}
      <button
        className="user-profile-button"
        onClick={handleMenuToggle}
        aria-expanded={isMenuOpen}
        aria-label="Google 계정"
      >
        <img
          className="user-profile-image"
          src="https://lh3.google.com/u/0/ogw/AF2bZyh9eO9Qq2r73JoWUfq_4dPuDY40lGTgr3mn2bvZJNaEcA=s32-c-mo"
          srcSet="https://lh3.google.com/u/0/ogw/AF2bZyh9eO9Qq2r73JoWUfq_4dPuDY40lGTgr3mn2bvZJNaEcA=s32-c-mo 1x, https://lh3.google.com/u/0/ogw/AF2bZyh9eO9Qq2r73JoWUfq_4dPuDY40lGTgr3mn2bvZJNaEcA=s64-c-mo 2x"
          alt="User Profile"
          aria-hidden="true"
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div className="menu-dropdown">
          <p>whirae kim (lacuca9@gmail.com)</p>
          <button onClick={handleSignOut} className="sign-out-button">
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
