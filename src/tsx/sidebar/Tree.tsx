import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import { useRedux } from '../state/AppStore';
import { TreeView } from '@material-ui/lab';
import { isLetterConsonant } from '../utils/LetterGroups';
import TreeItemWrapper from './TreeItemWrapper';

const MinusSquare: React.FunctionComponent<SvgIconProps> = React.memo((props: SvgIconProps) => (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
));

const PlusSquare: React.FunctionComponent<SvgIconProps> = React.memo((props: SvgIconProps) => (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
));

const CloseSquare: React.FunctionComponent<SvgIconProps> = React.memo((props: SvgIconProps) => (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
));

interface TreeProps {}

const Tree: React.FunctionComponent<TreeProps> = ({}) => {
    const sentences = useRedux((state) => state.sentences);
    const selection = useRedux((state) => state.selection);

    return (
        <TreeView
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            selected={selection ?? ''}
        >
            {sentences.map((sentence) => (
                <TreeItemWrapper
                    key={sentence.circleId}
                    text={sentence.text}
                    circleId={sentence.circleId}
                    lineSlots={sentence.lineSlots}
                >
                    {sentence.words.map((word) => (
                        <TreeItemWrapper
                            key={word.circleId}
                            text={word.text}
                            circleId={word.circleId}
                            lineSlots={word.lineSlots}
                        >
                            {word.letters.map((letter) =>
                                isLetterConsonant(letter) ? (
                                    <TreeItemWrapper
                                        key={letter.circleId}
                                        text={letter.vocal
                                            .map((vocal) => letter.text + vocal.text)
                                            .unwrapOr(letter.text)}
                                        circleId={letter.circleId}
                                        lineSlots={letter.lineSlots}
                                    >
                                        {letter.dots.map((dot) => (
                                            <TreeItemWrapper key={dot} text="DOT" circleId={dot} lineSlots={[]} />
                                        ))}
                                        {letter.vocal
                                            .map((vocal) => (
                                                <TreeItemWrapper
                                                    key={vocal.circleId}
                                                    text={vocal.text}
                                                    circleId={vocal.circleId}
                                                    lineSlots={vocal.lineSlots}
                                                />
                                            ))
                                            .asNullable()}
                                    </TreeItemWrapper>
                                ) : (
                                    <TreeItemWrapper
                                        key={letter.circleId}
                                        text={letter.text}
                                        circleId={letter.circleId}
                                        lineSlots={letter.lineSlots}
                                    />
                                )
                            )}
                        </TreeItemWrapper>
                    ))}
                </TreeItemWrapper>
            ))}
        </TreeView>
    );
};

export default Tree;
