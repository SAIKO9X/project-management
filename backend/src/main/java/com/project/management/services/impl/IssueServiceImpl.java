package com.project.management.services.impl;

import com.project.management.models.entities.*;
import com.project.management.models.enums.IssuePriority;
import com.project.management.models.enums.IssueStatus;
import com.project.management.models.enums.IssueType;
import com.project.management.repositories.IssueRepository;
import com.project.management.repositories.MilestoneRepository;
import com.project.management.repositories.TagRepository;
import com.project.management.request.IssueRequest;
import com.project.management.services.IssueService;
import com.project.management.services.ProjectService;
import com.project.management.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementação do serviço para gerenciamento de issues em projetos.
 * Fornece operações completas para criação, atualização, exclusão e gerenciamento de issues,
 * incluindo associação com usuários, tags, milestones e validação de permissões.
 */
@Service
public class IssueServiceImpl implements IssueService {

  @Autowired
  private IssueRepository issueRepository;

  @Autowired
  private ProjectService projectService;

  @Autowired
  private UserService userService;

  @Autowired
  private TagRepository tagRepository;

  @Autowired
  private MilestoneRepository milestoneRepository;

  /**
   * Recupera uma issue pelo seu ID.
   *
   * @param issueId ID da issue a ser recuperada
   * @return entidade da issue encontrada
   * @throws Exception se a issue não for encontrada
   */
  @Override
  public Issue getIssueById(Long issueId) throws Exception {
    Optional<Issue> issue = issueRepository.findById(issueId);
    if (issue.isPresent()) {
      return issue.get();
    }
    throw new Exception("Nenhum problema encontrado com issueId: " + issueId);
  }

  /**
   * Recupera todas as issues associadas a um projeto específico.
   *
   * @param projectId ID do projeto
   * @return lista de issues do projeto especificado
   * @throws Exception se houver erro na consulta
   */
  @Override
  public List<Issue> getIssueByProjectId(Long projectId) throws Exception {
    return issueRepository.findByProjectId(projectId);
  }

  /**
   * Cria uma nova issue com base nos dados fornecidos na requisição.
   * Define valores padrão para status, prioridade e tipo se não especificados.
   * Valida se o milestone pertence ao mesmo projeto da issue.
   *
   * @param issueRequest dados da issue a ser criada
   * @param user         usuário que está criando a issue (será definido como criador)
   * @return entidade da issue criada e salva
   * @throws Exception se o projeto não for encontrado ou o milestone pertencer a outro projeto
   */
  @Override
  public Issue createIssue(IssueRequest issueRequest, User user) throws Exception {
    Project project = projectService.getProjectById(issueRequest.projectId());

    Issue issue = new Issue();
    issue.setTitle(issueRequest.title());
    issue.setDescription(issueRequest.description());
    issue.setStatus(issueRequest.status() != null ? IssueStatus.valueOf(issueRequest.status()) : IssueStatus.A_FAZER);
    issue.setProjectID(issueRequest.projectId());
    issue.setPriority(issueRequest.priority() != null ? IssuePriority.valueOf(issueRequest.priority()) : IssuePriority.BAIXA);
    issue.setType(issueRequest.type() != null ? IssueType.valueOf(issueRequest.type()) : IssueType.TASK);
    issue.setDueDate(issueRequest.dueDate());
    issue.setProject(project);
    issue.setCreator(user); // Define o criador como o usuário autenticado

    if (issueRequest.milestoneId() != null) {
      Milestone milestone = milestoneRepository.findById(issueRequest.milestoneId())
        .orElseThrow(() -> new Exception("Milestone não encontrado"));
      if (!milestone.getProject().getId().equals(project.getId())) {
        throw new Exception("Milestone pertence a um projeto diferente.");
      }
      issue.setMilestone(milestone);
    }

    return issueRepository.save(issue);
  }

  /**
   * Atualiza o status de uma issue específica.
   *
   * @param issueId ID da issue a ser atualizada
   * @param status  novo status da issue
   * @return entidade da issue atualizada
   * @throws Exception se a issue não for encontrada
   */
  @Override
  public Issue updateIssue(Long issueId, String status) throws Exception {
    Issue issue = getIssueById(issueId);
    issue.setStatus(IssueStatus.valueOf(status));
    return issueRepository.save(issue);
  }

  /**
   * Exclui uma issue com validação de autorização.
   * Apenas o proprietário do projeto pode excluir issues.
   *
   * @param issueId ID da issue a ser excluída
   * @param userId  ID do usuário solicitando a exclusão
   * @throws Exception se a issue não for encontrada ou o usuário não tiver permissão
   */
  @Override
  public void deleteIssue(Long issueId, Long userId) throws Exception {
    Issue issue = getIssueById(issueId);
    if (!issue.getProject().getOwner().getId().equals(userId)) {
      throw new Exception("Você não tem permissão para deletar esta issue.");
    }
    issueRepository.deleteById(issueId);
  }

  /**
   * Atribui um usuário como responsável por uma issue.
   *
   * @param issueId ID da issue
   * @param userId  ID do usuário a ser atribuído
   * @return entidade da issue atualizada com o usuário atribuído
   * @throws Exception se a issue ou usuário não forem encontrados
   */
  @Override
  public Issue addUserToIssue(Long issueId, Long userId) throws Exception {
    User user = userService.findUserById(userId);
    Issue issue = getIssueById(issueId);
    issue.setAssignee(user);
    return issueRepository.save(issue);
  }

  /**
   * Atualiza completamente uma issue com validação de autorização.
   * Permite que o proprietário do projeto ou o usuário atribuído à issue façam alterações.
   * Atualiza apenas os campos que não são nulos na issue fornecida.
   *
   * @param issueId      ID da issue a ser atualizada
   * @param updatedIssue entidade com os novos dados da issue
   * @param userId       ID do usuário solicitando a atualização
   * @return entidade da issue atualizada
   * @throws Exception se a issue não for encontrada ou o usuário não tiver permissão
   */
  @Override
  public Issue updateIssueFull(Long issueId, Issue updatedIssue, Long userId) throws Exception {
    Issue issue = getIssueById(issueId);
    userService.findUserById(userId);

    if (!issue.getProject().getOwner().getId().equals(userId) &&
      (issue.getAssignee() == null || !issue.getAssignee().getId().equals(userId))) {
      throw new Exception("Você não tem permissão para editar esta issue.");
    }

    if (updatedIssue.getTitle() != null) {
      issue.setTitle(updatedIssue.getTitle());
    }
    if (updatedIssue.getDescription() != null) {
      issue.setDescription(updatedIssue.getDescription());
    }
    if (updatedIssue.getStatus() != null) {
      issue.setStatus(updatedIssue.getStatus());
    }
    if (updatedIssue.getPriority() != null) {
      issue.setPriority(updatedIssue.getPriority());
    }
    if (updatedIssue.getType() != null) {
      issue.setType(updatedIssue.getType());
    }
    if (updatedIssue.getDueDate() != null) {
      issue.setDueDate(updatedIssue.getDueDate());
    }
    if (updatedIssue.getTags() != null) {
      issue.setTags(updatedIssue.getTags());
    }
    if (updatedIssue.getMilestone() != null) {
      issue.setMilestone(updatedIssue.getMilestone());
    }

    return issueRepository.save(issue);
  }

  /**
   * Adiciona uma tag a uma issue específica.
   * Verifica se a tag já não está associada à issue antes de adicionar.
   *
   * @param issueId ID da issue
   * @param tagId   ID da tag a ser adicionada
   * @return entidade da issue atualizada com a nova tag
   * @throws Exception se a issue ou tag não forem encontradas
   */
  @Override
  public Issue addTagToIssue(Long issueId, Long tagId) throws Exception {
    Issue issue = getIssueById(issueId);
    Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new Exception("Tag não encontrada"));
    if (!issue.getTags().contains(tag)) {
      issue.getTags().add(tag);
      return issueRepository.save(issue);
    }
    return issue;
  }

  /**
   * Remove uma tag de uma issue específica.
   *
   * @param issueId ID da issue
   * @param tagId   ID da tag a ser removida
   * @return entidade da issue atualizada sem a tag especificada
   * @throws Exception se a issue ou tag não forem encontradas
   */
  @Override
  public Issue removeTagFromIssue(Long issueId, Long tagId) throws Exception {
    Issue issue = getIssueById(issueId);
    Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new Exception("Tag não encontrada"));
    issue.getTags().remove(tag);
    return issueRepository.save(issue);
  }

  /**
   * Atribui um milestone a uma issue específica.
   * Valida se o milestone pertence ao mesmo projeto da issue.
   *
   * @param issueId     ID da issue
   * @param milestoneId ID do milestone a ser atribuído
   * @return entidade da issue atualizada com o milestone
   * @throws Exception se a issue ou milestone não forem encontrados, ou se pertencerem a projetos diferentes
   */
  @Override
  public Issue assignMilestoneToIssue(Long issueId, Long milestoneId) throws Exception {
    Issue issue = getIssueById(issueId);
    Milestone milestone = milestoneRepository.findById(milestoneId).orElseThrow(() -> new Exception("Milestone não encontrado"));
    if (!issue.getProject().getId().equals(milestone.getProject().getId())) {
      throw new Exception("Milestone pertence a um projeto diferente.");
    }
    issue.setMilestone(milestone);
    return issueRepository.save(issue);
  }

  /**
   * Remove a associação de milestone de uma issue específica.
   *
   * @param issueId ID da issue
   * @return entidade da issue atualizada sem milestone
   * @throws Exception se a issue não for encontrada
   */
  @Override
  public Issue removeMilestoneFromIssue(Long issueId) throws Exception {
    Issue issue = getIssueById(issueId);
    issue.setMilestone(null);
    return issueRepository.save(issue);
  }

  /**
   * Recupera todas as tags associadas a uma issue específica.
   *
   * @param issueId ID da issue
   * @return lista de tags da issue especificada
   * @throws Exception se a issue não for encontrada
   */
  @Override
  public List<Tag> getIssueTagsById(Long issueId) throws Exception {
    Issue issue = getIssueById(issueId);
    return issue.getTags();
  }
}