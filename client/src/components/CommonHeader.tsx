import styles from '../styles/CommonHeader.module.scss';

type CommonHeaderProps = {
  showHistoryButton?: boolean;
  showBackToQuestionButton?: boolean;
  showBackToResultButton?: boolean;
  showBackToWelcomeButton?: boolean;
  onHistoryClick?: () => void;
  onBackToResultClick?: () => void;
  onBackToWelcomeClick?: () => void;
  onLogout: () => void;
  pageTitle?: string;
};

function CommonHeader({
  showHistoryButton = false,
  showBackToResultButton = false,
  showBackToWelcomeButton = false,
  onHistoryClick,
  onBackToResultClick,
  onBackToWelcomeClick,
  onLogout,
  pageTitle,
}: CommonHeaderProps) {
  return (
    <header className={styles.header}>
      {pageTitle && <h1 className={styles.pageTitle}>{pageTitle}</h1>}
      {!pageTitle && <div />}
      <div className={styles.headerButtons}>
        {showHistoryButton && onHistoryClick && (
          <button onClick={onHistoryClick} className={styles.historyButton}>
            過去の診断結果
          </button>
        )}
        {showBackToResultButton && onBackToResultClick && (
          <button onClick={onBackToResultClick} className={styles.resultButton}>
            前の画面に戻る
          </button>
        )}
        {showBackToWelcomeButton && onBackToWelcomeClick && (
          <button onClick={onBackToWelcomeClick} className={styles.homeButton}>
            ホームに戻る
          </button>
        )}
        <button onClick={onLogout} className={styles.logoutButton}>
          ログアウト
        </button>
      </div>
    </header>
  );
}

export default CommonHeader;
