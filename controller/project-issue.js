const { Project, Issue, IssueComment, ProjectMember } = require("../models");
const { Op } = require("sequelize");

// 사용자가 프로젝트의 멤버인지 확인하는 함수

// 프로젝트 이슈 조회
exports.getProjectIssues = async (req, res) => {
    try {
        const { project_id } = req.body; // 요청에서 프로젝트 ID를 가져옵니다.
        const user_id = req.userId; // 현재 사용자의 ID를 가져옵니다.
        console.log(project_id, user_id);
        // 프로젝트 멤버 여부 확인

        const projectId = project_id;
        const projectIssues = await Issue.findAll({ where: { projectId } });
        res.json({ success: true, projectIssues });
    } catch (error) {
        console.error("프로젝트 이슈 조회 오류:", error);
        res.status(500).json({ success: false, message: "서버 오류로 인해 프로젝트 이슈 조회에 실패했습니다." });
    }
};

// 프로젝트 이슈 검색
exports.searchProjectIssues = async (req, res) => {
    const { keyword } = req.query;

    try {
        const projectIssues = await Issue.findAll({ where: { title: { [Op.like]: `%${keyword}%` } } });
        res.json({ success: true, projectIssues });
    } catch (error) {
        console.error("프로젝트 이슈 검색 오류:", error);
        res.status(500).json({ success: false, message: "서버 오류로 인해 프로젝트 이슈 검색에 실패했습니다." });
    }
};

// 프로젝트 이슈 상세 조회
exports.getProjectIssueDetail = async (req, res) => {
    const { id, project_id } = req.params;

    try {
        const projectIssue = await Issue.findByPk(id);
        if (projectIssue) {
            res.json({ success: true, projectIssue });
        } else {
            res.status(404).json({ success: false, message: "해당 프로젝트 이슈를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("프로젝트 이슈 상세 조회 오류:", error);
        res.status(500).json({ success: false, message: "서버 오류로 인해 프로젝트 이슈 상세 조회에 실패했습니다." });
    }
};

// 프로젝트 이슈 작성
exports.createProjectIssue = async (req, res) => {
    const { issue_title, issue_content, project_id, files } = req.body;
    try {
        const userId = req.userId; // 현재 사용자의 ID를 가져옵니다.

        // 프로젝트 멤버 여부 확인
        const member = await isMember(project_id, userId);
        if (member) {
            // 현재 사용자가 프로젝트의 멤버일 경우에만 이슈를 작성합니다.
            const newProjectIssue = await Issue.create({ issue_title, issue_content, project_id });
            res.json({ success: true, newProjectIssue });
        } else {
            // 현재 사용자가 프로젝트의 멤버가 아닌 경우 에러를 반환합니다.
            res.status(403).json({ success: false, message: "해당 프로젝트의 멤버가 아닙니다." });
        }
    } catch (error) {
        console.error("프로젝트 이슈 작성 오류:", error);
        res.status(500).json({ success: false, message: "서버 오류로 인해 프로젝트 이슈 작성에 실패했습니다." });
    }
};
