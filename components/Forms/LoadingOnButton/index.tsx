import styles from 'styles/loading.module.css';

const LoadingOnButton = ({ color = 'bg-white' }: { color?: string }) => {
  return (
    <div className={styles.loader + ' flex space-x-1 justify-center'}>
      <div className={`w-1 h-1 ${color} rounded-full animate-pulse`}></div>
      <div className={`w-1 h-1 ${color} rounded-full animate-pulse`}></div>
      <div className={`w-1 h-1 ${color} rounded-full animate-pulse`}></div>
    </div>
  );
};

export default LoadingOnButton;
