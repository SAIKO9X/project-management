package com.project.management.controllers;

import com.project.management.models.entities.Chat;
import com.project.management.models.entities.Message;
import com.project.management.models.entities.User;
import com.project.management.request.CreateMessageRequest;
import com.project.management.services.MessageService;
import com.project.management.services.ProjectService;
import com.project.management.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsável pelos endpoints de gerenciamento de mensagens.
 * Fornece operações para envio de mensagens e recuperação do histórico de chat
 * com validação adequada e tratamento de erros.
 */
@RestController
@RequestMapping("/api/messages")
public class MessageController {

  @Autowired
  private MessageService messageService;

  @Autowired
  private UserService userService;

  @Autowired
  private ProjectService projectService;

  /**
   * Envia uma nova mensagem para o chat de um projeto específico.
   *
   * @param request dados da mensagem incluindo ID do remetente, ID do projeto e conteúdo
   * @return mensagem enviada com sucesso ou erro se usuário/chat não encontrado
   * @throws Exception se o usuário não for encontrado ou o chat não existir
   */
  @PostMapping("/send")
  public ResponseEntity<Message> sendMessage(@RequestBody CreateMessageRequest request) throws Exception {

    User user = userService.findUserById(request.senderId());
    if (user == null) throw new Exception("Usuário não encontrado para o id: " + request.senderId());

    Chat chats = projectService.getChatByProjectId(request.projectId()).getProject().getChat();
    if (chats == null) throw new Exception("Chat não encontrado");

    Message sentMessage = messageService.sendMessage(request.senderId(), request.projectId(), request.content());

    return ResponseEntity.ok(sentMessage);
  }

  /**
   * Recupera todas as mensagens de um chat específico baseado no ID do projeto.
   *
   * @param projectId identificador do projeto para buscar as mensagens do chat
   * @return lista de mensagens do chat ordenadas ou erro se projeto não encontrado
   * @throws Exception se o projeto não existir ou ocorrer erro na busca
   */
  @GetMapping("/chat/{projectId}")
  public ResponseEntity<List<Message>> getMessageByChatId(@PathVariable Long projectId) throws Exception {

    // Busca todas as mensagens do chat do projeto
    List<Message> messages = messageService.getMessageByProjectId(projectId);

    return ResponseEntity.ok(messages);
  }
}