
import OpenEnd from "../question-type/Openend";
import ClosedEnd from "../question-type/Closedend";
import Range from "../question-type/Range";
import SingleChoice from "../question-type/SingleChoice";
import MultipleChoice from "../question-type/MultipleChoice";
import Ranking from "../question-type/Ranking";
import Rating from "../question-type/Rating";

const map = {
  openend: OpenEnd,
  closedend: ClosedEnd,
  range: Range,
  singlechoice: SingleChoice,
  multiplechoice: MultipleChoice,
  rankingorder: Ranking,
  rating: Rating,
};

export default function QuestionTypeRenderer({ type, onChange }) {
  if (!type) return null;

  const Component = map[type];
  return <Component onChange={onChange} />;
}