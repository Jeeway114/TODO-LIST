import { Text } from 'react-native';

type Props = { text: string; keyword: string };

export function Highlighter({ text, keyword }: Props) {
  if (!keyword) return <Text>{text}</Text>;
  const k = keyword.toLowerCase();
  const parts = text.split(new RegExp(`(${escapeRegExp(keyword)})`, 'ig'));
  return (
    <Text>
      {parts.map((p, i) =>
        p.toLowerCase() === k ? <Text key={i} style={{ backgroundColor: '#fff59d' }}>{p}</Text> : <Text key={i}>{p}</Text>
      )}
    </Text>
  );
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
