// we know the drill

// only global types or interfaces are allowed

type log = {
  info: (message: string) => void;
};

interface Log {
  info: (message: string) => void;
}
