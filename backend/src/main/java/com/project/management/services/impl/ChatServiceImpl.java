package com.project.management.services.impl;

import com.project.management.models.entities.Chat;
import com.project.management.repositories.ChatRepository;
import com.project.management.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementação do serviço para gerenciamento de chats de projeto.
 * Fornece operações para criação e gerenciar recursos de comunicação em projetos.
 */
@Service
public class ChatServiceImpl implements ChatService {

  @Autowired
  private ChatRepository chatRepository;

  /**
   * Cria um novo chat associado a um projeto.
   *
   * @param chat Chat a ser criado
   * @return Entidade do chat salvo
   * @throws Exception Se ocorrer erro na persistência
   */
  @Override
  public Chat createChat(Chat chat) throws Exception {
    return chatRepository.save(chat);
  }
}